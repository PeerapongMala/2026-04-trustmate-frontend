import type { Metadata, Viewport } from "next";
import { BackendWarmer } from "@/shared/components/BackendWarmer";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrustMate — เพื่อนที่รับฟัง",
  description:
    "แอปสุขภาพจิต เน้นความปลอดภัยและไม่ระบุตัวตน โพสต์ระบาย คุยกับ AI ทำแบบประเมิน จองคิวปรึกษา",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full">
      <body className="min-h-full bg-tm-bg text-tm-gray antialiased">
        <BackendWarmer />
        {children}
      </body>
    </html>
  );
}
