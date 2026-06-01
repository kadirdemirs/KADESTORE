"use client";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "./CartProvider";

export default function SessionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}
