"use client";

import AccessDenied from "@/components/admin/AccessDenied";
import MainLayout from "@/components/layouts/MainLayout";
import { useAuth } from "@/lib/hooks/useAuth";

export default function AdminLayout({ children }: { readonly children: React.ReactNode }) {
  const { isAdmin, user } = useAuth();

  if (!isAdmin || user === null) return (
    <MainLayout>
      <AccessDenied />
    </MainLayout>
  );

  return <MainLayout adminPage={true}>{children}</MainLayout>;
}
