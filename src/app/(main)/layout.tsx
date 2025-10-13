import MainLayout from "@/components/layouts/MainLayout";

export default function MainRootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}