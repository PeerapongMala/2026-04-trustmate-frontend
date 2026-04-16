"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-4">
        {children}
      </div>
    </GoogleOAuthProvider>
  );
}
