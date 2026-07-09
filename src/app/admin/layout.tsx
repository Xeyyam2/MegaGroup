import { Toaster } from "sonner";

// Bütün /admin route-ları (login, reset-password, CMS) üçün toxasdır.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster theme="dark" position="top-right" richColors closeButton />
    </>
  );
}
