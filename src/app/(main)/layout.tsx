import { MainLayout } from "@/components/layouts";

export default function MainRootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <MainLayout>{children}</MainLayout>
  );
}