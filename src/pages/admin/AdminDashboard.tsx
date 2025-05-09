
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { useSupabase } from '@/context/SupabaseContext';
import { AnalyticsDashboard } from '@/components/admin/analytics/AnalyticsDashboard';

export default function AdminDashboard() {
  const { isAdmin, user } = useSupabase();

  return (
    <AdminLayout>
      <AnalyticsDashboard />
    </AdminLayout>
  );
}
