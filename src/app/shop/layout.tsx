"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useGetCartQuery } from "@/services/api";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: cartData } = useGetCartQuery();

  return <>{children}</>;
}
