"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Hash,
  ShieldCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => Promise<void>;
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  deliveryFee?: number;
}

interface DeliveryResponse {
  success: boolean;
  isDeliveryAvailable: boolean;
  message: string;
  deliveryFee?: number;
  fullAddress?: string;
}

const FormSection = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-first/10 rounded-lg">
        <Icon className="w-5 h-5 text-first" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

const InputWrapper = ({
  children,
  label,
  error,
}: {
  children: React.ReactNode;
  label: string;
  error?: string;
}) => (
  <div className="space-y-2">
    <Label className="text-gray-700 font-medium">{label}</Label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit }) => {
  const [isValidatingAddress, setIsValidatingAddress] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState<{
    isValid: boolean;
    fee: number | null;
    message: string;
    status: string;
  } | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>();

  const address = watch("address");
  const city = watch("city");
  const postalCode = watch("postalCode");

  // Validate delivery address when address fields change
  React.useEffect(() => {
    const validateDelivery = async () => {
      if (address && city && postalCode) {
        setIsValidatingAddress(true);
        try {
          const response = await fetch("/api/check-delivery", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address, city, postalCode }),
          });

          const result: DeliveryResponse = await response.json();

          setDeliveryInfo({
            isValid: result.isDeliveryAvailable,
            fee: result.deliveryFee || null,
            message: result.message,
            status: result.message.includes("⚠️")
              ? "warning"
              : result.isDeliveryAvailable
              ? "success"
              : "error",
          });
        } catch (error) {
          setDeliveryInfo({
            isValid: false,
            fee: null,
            message: "Fehler bei der Überprüfung der Lieferadresse.",
            status: "error",
          });
        } finally {
          setIsValidatingAddress(false);
        }
      }
    };

    const debounceTimer = setTimeout(validateDelivery, 1000);
    return () => clearTimeout(debounceTimer);
  }, [address, city, postalCode]);

  const handleFormSubmit = async (data: CheckoutFormData) => {
    if (!deliveryInfo?.isValid) {
      toast.error("Bitte geben Sie eine gültige Lieferadresse ein.");
      return;
    }

    const loadingToast = toast.loading(
      "Bitte warten Sie, während Ihre Bestellung bestätigt wird. Dies kann einen Moment dauern..."
    );
    try {
      await onSubmit({
        ...data,
        deliveryFee: deliveryInfo.fee || 0,
      });
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <form
        className="space-y-10 bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Ihre Informationen
          </h2>
          <p className="text-gray-500">
            Bitte füllen Sie alle erforderlichen Felder aus, um Ihre Bestellung
            abzuschließen.
          </p>
        </div>

        {/* Personal Information */}
        <FormSection title="Persönliche Daten" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="firstName"
              control={control}
              rules={{ required: "Vorname ist erforderlich" }}
              render={({ field }) => (
                <InputWrapper label="Vorname" error={errors.firstName?.message}>
                  <div className="relative group">
                    <Input
                      {...field}
                      placeholder="Max"
                      className={`pl-10 focus-visible:ring-first group-hover:border-gray-300 transition-colors ${
                        errors.firstName
                          ? "border-red-200 focus-visible:ring-red-500"
                          : "border-gray-200"
                      }`}
                    />
                    <User className="w-4 h-4 absolute left-3 top-3 text-gray-400 group-hover:text-gray-500 transition-colors" />
                  </div>
                </InputWrapper>
              )}
            />

            <Controller
              name="lastName"
              control={control}
              rules={{ required: "Nachname ist erforderlich" }}
              render={({ field }) => (
                <InputWrapper label="Nachname" error={errors.lastName?.message}>
                  <div className="relative group">
                    <Input
                      {...field}
                      placeholder="Mustermann"
                      className={`pl-10 focus-visible:ring-first group-hover:border-gray-300 transition-colors ${
                        errors.lastName
                          ? "border-red-200 focus-visible:ring-red-500"
                          : "border-gray-200"
                      }`}
                    />
                    <User className="w-4 h-4 absolute left-3 top-3 text-gray-400 group-hover:text-gray-500 transition-colors" />
                  </div>
                </InputWrapper>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="email"
              control={control}
              rules={{
                required: "E-Mail ist erforderlich",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Ungültige E-Mail-Adresse",
                },
              }}
              render={({ field }) => (
                <InputWrapper label="E-Mail" error={errors.email?.message}>
                  <div className="relative group">
                    <Input
                      {...field}
                      type="email"
                      placeholder="max@beispiel.de"
                      className={`pl-10 focus-visible:ring-first group-hover:border-gray-300 transition-colors ${
                        errors.email
                          ? "border-red-200 focus-visible:ring-red-500"
                          : "border-gray-200"
                      }`}
                    />
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400 group-hover:text-gray-500 transition-colors" />
                  </div>
                </InputWrapper>
              )}
            />

            <Controller
              name="phone"
              control={control}
              rules={{ required: "Telefonnummer ist erforderlich" }}
              render={({ field }) => (
                <InputWrapper
                  label="Telefonnummer"
                  error={errors.phone?.message}
                >
                  <div className="relative group">
                    <Input
                      {...field}
                      type="tel"
                      placeholder="+49 123 45678900"
                      className={`pl-10 focus-visible:ring-first group-hover:border-gray-300 transition-colors ${
                        errors.phone
                          ? "border-red-200 focus-visible:ring-red-500"
                          : "border-gray-200"
                      }`}
                    />
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400 group-hover:text-gray-500 transition-colors" />
                  </div>
                </InputWrapper>
              )}
            />
          </div>
        </FormSection>

        {/* Address Section */}
        <FormSection title="Lieferadresse" icon={MapPin}>
          <Controller
            name="address"
            control={control}
            rules={{ required: "Adresse ist erforderlich" }}
            render={({ field }) => (
              <InputWrapper
                label="Straße und Hausnummer"
                error={errors.address?.message}
              >
                <div className="relative group">
                  <Input
                    {...field}
                    placeholder="Musterstraße 123"
                    className={`pl-10 focus-visible:ring-first group-hover:border-gray-300 transition-colors ${
                      errors.address || (deliveryInfo && !deliveryInfo.isValid)
                        ? "border-red-200 focus-visible:ring-red-500"
                        : "border-gray-200"
                    }`}
                  />
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400 group-hover:text-gray-500 transition-colors" />
                </div>
              </InputWrapper>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="city"
              control={control}
              rules={{ required: "Stadt ist erforderlich" }}
              render={({ field }) => (
                <InputWrapper label="Stadt" error={errors.city?.message}>
                  <div className="relative group">
                    <Input
                      {...field}
                      placeholder="Berlin"
                      className={`pl-10 focus-visible:ring-first group-hover:border-gray-300 transition-colors ${
                        errors.city
                          ? "border-red-200 focus-visible:ring-red-500"
                          : "border-gray-200"
                      }`}
                    />
                    <Building className="w-4 h-4 absolute left-3 top-3 text-gray-400 group-hover:text-gray-500 transition-colors" />
                  </div>
                </InputWrapper>
              )}
            />

            <Controller
              name="postalCode"
              control={control}
              rules={{ required: "PLZ ist erforderlich" }}
              render={({ field }) => (
                <InputWrapper label="PLZ" error={errors.postalCode?.message}>
                  <div className="relative group">
                    <Input
                      {...field}
                      placeholder="12345"
                      className={`pl-10 focus-visible:ring-first group-hover:border-gray-300 transition-colors ${
                        errors.postalCode
                          ? "border-red-200 focus-visible:ring-red-500"
                          : "border-gray-200"
                      }`}
                    />
                    <Hash className="w-4 h-4 absolute left-3 top-3 text-gray-400 group-hover:text-gray-500 transition-colors" />
                  </div>
                </InputWrapper>
              )}
            />
          </div>
        </FormSection>

        {/* Delivery Information Display */}
        <AnimatePresence>
          {isValidatingAddress && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center py-3 px-4 bg-gray-50 text-gray-600 rounded-xl"
            >
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span>Überprüfe Lieferadresse...</span>
            </motion.div>
          )}

          {deliveryInfo && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-xl border ${
                deliveryInfo.status === "success"
                  ? "bg-green-50 border-green-100 text-green-700"
                  : deliveryInfo.status === "warning"
                  ? "bg-yellow-50 border-yellow-100 text-yellow-700"
                  : "bg-red-50 border-red-100 text-red-700"
              }`}
            >
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 mt-0.5" />
                <div>
                  {deliveryInfo.message}
                  {deliveryInfo.fee && (
                    <div className="mt-1 font-medium">
                      Liefergebühr: {deliveryInfo.fee}€
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={
              isSubmitting || isValidatingAddress || !deliveryInfo?.isValid
            }
            className="w-full bg-first text-black py-4 rounded-xl font-semibold 
                     hover:bg-first/90 transition-all duration-200
                     disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2 shadow-sm hover:shadow group"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Wird verarbeitet...</span>
              </>
            ) : (
              <>
                <span>Bestellung aufgeben</span>
                <motion.div
                  animate={deliveryInfo?.isValid ? { x: [0, 3, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ShieldCheck className="w-5 h-5" />
                </motion.div>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CheckoutForm;
