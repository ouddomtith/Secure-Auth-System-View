"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get("token");
    router.replace(token ? "/dashboard" : "/login");
  }, [router]);

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-aurora border-t-transparent animate-spin" />
    </div>
  );
}
