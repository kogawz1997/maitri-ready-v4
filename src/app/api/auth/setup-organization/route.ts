import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { parseJson } from '@/lib/http/validation';

const schema = z.object({
  fullName: z.string().trim().min(2).max(120),
  hotelName: z.string().trim().min(2).max(160),
});

function toSlug(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9ก-๙]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'hotel';
}

export async function POST(request: Request): Promise<Response> {
  const parsed = await parseJson(request, schema);
  if (parsed.error) return parsed.error as Response;
  const { fullName, hotelName } = parsed.data;

  const sessionSupabase = await createClient();
  const { data: { user }, error: authError } = await sessionSupabase.auth.getUser();
  if (authError || !user?.id || !user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: existingProfile } = await admin
    .from('user_profiles')
    .select('organization_id')
    .eq('id', user.id)
    .maybeSingle();

  if (existingProfile?.organization_id) {
    return NextResponse.json({ success: true, organizationId: existingProfile.organization_id, alreadyConfigured: true });
  }

  const slug = `${toSlug(hotelName)}-${crypto.randomUUID().slice(0, 8)}`;

  const { data: org, error: orgError } = await admin
    .from('organizations')
    .insert({ name: hotelName, slug })
    .select()
    .single();

  if (orgError) {
    console.error('[setup-organization] organization insert failed', orgError);
    return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 });
  }

  const { data: hotel, error: hotelError } = await admin
    .from('hotels')
    .insert({ organization_id: org.id, name: hotelName, slug, type: 'hotel', email: user.email })
    .select()
    .single();

  if (hotelError) {
    await admin.from('organizations').delete().eq('id', org.id);
    console.error('[setup-organization] hotel insert failed', hotelError);
    return NextResponse.json({ error: 'Failed to create hotel workspace' }, { status: 500 });
  }

  const { error: profileError } = await admin.from('user_profiles').upsert({
    id: user.id,
    organization_id: org.id,
    email: user.email,
    full_name: fullName,
    role: 'owner',
    active: true,
  }, { onConflict: 'id' });

  if (profileError) {
    await admin.from('hotels').delete().eq('id', hotel.id);
    await admin.from('organizations').delete().eq('id', org.id);
    console.error('[setup-organization] profile upsert failed', profileError);
    return NextResponse.json({ error: 'Failed to create owner profile' }, { status: 500 });
  }

  const { data: roomTypes, error: roomTypesError } = await admin
    .from('room_types')
    .insert([
      { hotel_id: hotel.id, name: 'Standard Room', code: 'STD', max_occupancy: 2, base_rate: 1200, bed_type: 'queen', size_sqm: 24 },
      { hotel_id: hotel.id, name: 'Deluxe Room', code: 'DLX', max_occupancy: 2, base_rate: 1800, bed_type: 'king', size_sqm: 32 },
      { hotel_id: hotel.id, name: 'Family Room', code: 'FAM', max_occupancy: 4, base_rate: 2600, bed_type: 'king + twin', size_sqm: 42 },
    ])
    .select('id, code');

  if (roomTypesError) {
    console.error('[setup-organization] starter room types failed', roomTypesError);
  } else if (roomTypes?.length) {
    const byCode = Object.fromEntries(roomTypes.map((roomType) => [roomType.code, roomType.id]));
    const starterRooms = [
      { room_number: '101', floor: 1, room_type_id: byCode.STD },
      { room_number: '102', floor: 1, room_type_id: byCode.STD },
      { room_number: '201', floor: 2, room_type_id: byCode.DLX },
      { room_number: '202', floor: 2, room_type_id: byCode.DLX },
      { room_number: '301', floor: 3, room_type_id: byCode.FAM },
    ].filter((room) => room.room_type_id).map((room) => ({ ...room, hotel_id: hotel.id, status: 'available' }));

    const { error: roomsError } = await admin.from('rooms').insert(starterRooms);
    if (roomsError) console.error('[setup-organization] starter rooms failed', roomsError);
  }

  await admin.from('audit_logs').insert({
    hotel_id: hotel.id,
    user_id: user.id,
    action: 'organization.created',
    entity_type: 'organization',
    entity_id: org.id,
    changes: { hotelName, fullName },
  });

  return NextResponse.json({ success: true, organizationId: org.id, hotelId: hotel.id });
}
