"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetCartQuery, useDeletePackageMutation } from "@/services/api";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: cartData } = useGetCartQuery();
  const [deletePackage] = useDeletePackageMutation();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only if we have cart.menu (in selection) and user is leaving the site
      if (cartData?.cart?.menu && !cartData?.cart?.order?.length) {
        deletePackage({}).catch((error) => {
          console.error("Error cleaning up incomplete package:", error);
        });
      }
    };

    // Only add listener when on shop page
    if (pathname.startsWith("/shop")) {
      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [pathname, cartData?.cart?.menu, cartData?.cart?.order, deletePackage]);

  return <>{children}</>;
}
