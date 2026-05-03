'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Building2, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [hotelName, setHotelName] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast.error('กรุณาเข้าสู่ระบบก่อนตั้งค่าโรงแรม');
      router.push('/auth/login');
      return;
    }

    const response = await fetch('/api/auth/setup-organization', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: fullName || session.user.user_metadata?.full_name || session.user.email,
        hotelName,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      toast.error(payload?.error || 'ตั้งค่าโรงแรมไม่สำเร็จ');
      setLoading(false);
      return;
    }

    toast.success('ตั้งค่าโรงแรมสำเร็จ');
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        <Building2 className="h-6 w-6" />
      </div>
      <div>
        <h1 className="font-display text-3xl font-medium tracking-tight">ตั้งค่าโรงแรมแรก</h1>
        <p className="text-sm text-muted-foreground mt-2">
          บัญชีพร้อมแล้ว เหลือสร้าง workspace โรงแรมก่อนเข้าระบบ
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="ชื่อโรงแรม"
          placeholder="เช่น Maitri Boutique Hotel"
          value={hotelName}
          onChange={(e) => setHotelName(e.target.value)}
          required
          minLength={2}
        />
        <Input
          label="ชื่อผู้ดูแล"
          placeholder="ชื่อของคุณ"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Button type="submit" className="w-full group" disabled={loading} size="lg">
          {loading ? 'กำลังตั้งค่า...' : (
            <>
              เริ่มใช้งาน Dashboard
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
