import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Luminary Auth",
  description: "Secure authentication platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1A1A24",
              color: "#D4D4E8",
              border: "1px solid #2E2E3D",
              borderRadius: "12px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#3ECFAA", secondary: "#0A0A0F" },
            },
            error: {
              iconTheme: { primary: "#E05C5C", secondary: "#0A0A0F" },
            },
          }}
        />
      </body>
    </html>
  );
}
