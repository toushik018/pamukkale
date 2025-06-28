"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  Download,
  Mail,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

const CompactStep = ({
  number,
  title,
  isActive,
}: {
  number: number;
  title: string;
  isActive: boolean;
}) => (
  <div
    className={`
    flex items-center gap-2 px-3 py-2 rounded-lg text-sm
    ${isActive ? "bg-first/10 text-gray-900" : "bg-gray-50 text-gray-500"}
  `}
  >
    <div
      className={`
      w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium
      ${isActive ? "bg-first text-black" : "bg-gray-200 text-gray-500"}
    `}
    >
      {number}
    </div>
    <span className="font-medium">{title}</span>
  </div>
);

const OrderConfirmationContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  useEffect(() => {
    if (!orderNumber) {
      router.push("/");
    }
  }, [orderNumber, router]);

  if (!orderNumber) return null;

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto pt-12 pb-16">
        {/* Header with Order Status */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-first/10 p-2 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-first" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Bestellung bestätigt
              </h1>
              <p className="text-sm text-gray-500">#{orderNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full">
            <span className="relative h-2 w-2">
              <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="absolute h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-xs font-medium text-green-700">
              Bestätigt
            </span>
          </div>
        </div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-xl p-5 mb-6"
        >
          <h2 className="text-sm font-medium text-gray-500 mb-3">
            Bestellstatus
          </h2>

          <div className="flex gap-2 mb-5">
            <CompactStep number={1} title="Bestätigt" isActive={true} />
            <CompactStep number={2} title="In Bearbeitung" isActive={false} />
            <CompactStep number={3} title="Abgeschlossen" isActive={false} />
          </div>

          <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-100">
            Ihre Bestellung wurde erfolgreich aufgenommen und wird in Kürze
            bearbeitet. Sie erhalten eine E-Mail-Bestätigung mit weiteren
            Details.
          </p>
        </motion.div>

        {/* Info Grid - Compact */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { icon: Mail, title: "E-Mail Bestätigung" },
            { icon: Download, title: "PDF Angebot" },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-100"
            >
              <div className="bg-gray-50 p-1.5 rounded-md">
                <item.icon className="w-4 h-4 text-gray-500" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {item.title}
              </span>
            </div>
          ))}
        </div>

        {/* Actions - Compact */}
        <div className="flex gap-3">
          <Link
            href="/"
            className="flex-1 flex items-center justify-center px-4 py-3 rounded-lg 
                    bg-first text-black font-medium text-sm hover:bg-first/90 transition-colors"
          >
            Startseite
            <ArrowRight className="ml-1.5 w-4 h-4" />
          </Link>
          <Link
            href="/shop"
            className="flex-1 flex items-center justify-center px-4 py-3 
                    bg-gray-100 text-gray-700 rounded-lg font-medium text-sm 
                    hover:bg-gray-200 transition-colors"
          >
            <ShoppingBag className="w-4 h-4 mr-1.5" />
            Neue Bestellung
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationContent;
