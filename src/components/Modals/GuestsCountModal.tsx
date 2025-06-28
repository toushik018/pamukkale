"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  X,
  Calendar as CalendarIcon,
  Clock,
  Minus,
  Plus,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GuestsCountModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: {
    id: number;
    name: string;
    minimumClients: number;
  };
  onSubmit: (data: { guestCount: number; date: string; time: string }) => void;
}

const GuestsCountModal: React.FC<GuestsCountModalProps> = ({
  isOpen,
  onClose,
  packageData,
  onSubmit,
}) => {
  const [guestCount, setGuestCount] = useState(packageData.minimumClients);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState(1);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleSubmit = async () => {
    if (guestCount < packageData.minimumClients) {
      setError(`Mindestens ${packageData.minimumClients} Gäste erforderlich`);
      return;
    }
    if (!date) {
      setError("Bitte wählen Sie ein Datum aus");
      return;
    }
    if (!time) {
      setError("Bitte wählen Sie eine Uhrzeit aus");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        guestCount,
        date: date ? format(date, "yyyy-MM-dd") : "",
        time: time,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestCountChange = (value: number | string) => {
    const count =
      typeof value === "string"
        ? parseInt(value) || packageData.minimumClients
        : value;
    const finalCount = Math.max(packageData.minimumClients, count);
    setGuestCount(finalCount);
    if (finalCount < packageData.minimumClients) {
      setError(`Mindestens ${packageData.minimumClients} Gäste erforderlich`);
    } else {
      setError("");
    }
  };

  // Get tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Generate time slots from 8:00 to 22:00
  const timeSlots = Array.from({ length: 29 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });

  if (!isMounted) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-second/10 backdrop-blur-md flex items-center justify-center z-50 px-4"
          onClick={onClose}
        >
          <motion.div
            key="modal-content"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-first w-full max-w-xl rounded-2xl p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-third to-transparent rounded-t-2xl" />

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-accentGray hover:text-second z-10"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>

            <div className="relative space-y-8">
              {/* Header */}
              <div className="flex items-start gap-6">
                <div className="shrink-0 w-16 h-16 bg-third rounded-xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-second" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-2xl font-medium text-second tracking-[-0.01em]">
                    {packageData.name}
                  </h3>
                  <p className="text-accentGray mt-1">
                    Mindestanzahl: {packageData.minimumClients} Gäste
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Guest Count */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-second">
                    Anzahl der Gäste
                  </label>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-third border border-third">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleGuestCountChange(guestCount - 1)}
                      className="w-10 h-10 rounded-lg bg-first flex items-center justify-center
                               text-accentGray hover:text-second border border-third
                               transition-colors duration-200"
                    >
                      <Minus className="w-4 h-4" strokeWidth={1.5} />
                    </motion.button>
                    <div className="relative w-20">
                      <input
                        type="number"
                        value={guestCount}
                        onChange={(e) => handleGuestCountChange(e.target.value)}
                        min={packageData.minimumClients}
                        className="w-full text-2xl font-medium text-second text-center bg-transparent
                                 focus:outline-none focus:ring-0 [-moz-appearance:_textfield]
                                 [&::-webkit-outer-spin-button]:appearance-none
                                 [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleGuestCountChange(guestCount + 1)}
                      className="w-10 h-10 rounded-lg bg-first flex items-center justify-center
                               text-accentGray hover:text-second border border-third
                               transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4" strokeWidth={1.5} />
                    </motion.button>
                  </div>
                </div>

                {/* Date Picker */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-second">
                    Gewünschtes Datum
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-[52px] justify-start text-left font-normal rounded-xl",
                          "border-third bg-second hover:border-accentGray",
                          !date && "text-accentGray"
                        )}
                      >
                        <CalendarIcon
                          className="mr-3 h-5 w-5 text-accentGray"
                          strokeWidth={1.5}
                        />
                        {date
                          ? format(date, "PPP", { locale: de })
                          : "Datum auswählen"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-third rounded-xl">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        fromDate={tomorrow}
                        locale={de}
                        className="rounded-lg"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Selector */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-second">
                    Gewünschte Uhrzeit
                  </label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger className="h-[52px] rounded-xl border-third bg-second hover:border-accentGray">
                      <SelectValue placeholder="Uhrzeit auswählen" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-third">
                      {timeSlots.map((slot) => (
                        <SelectItem
                          key={slot}
                          value={slot}
                          className="cursor-pointer focus:bg-third"
                        >
                          {slot} Uhr
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-red-50 border border-red-100"
                  >
                    <p className="text-sm text-red-600">{error}</p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  onClick={handleSubmit}
                  disabled={
                    !!error || !guestCount || !date || !time || isLoading
                  }
                  className="w-full h-[52px] bg-second text-first rounded-xl font-medium
                           transition-all duration-200
                           enabled:hover:bg-second/90
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Wird geladen...</span>
                    </>
                  ) : (
                    <>
                      <span>Weiter zur Auswahl</span>
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          ease: "easeInOut",
                        }}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </motion.div>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GuestsCountModal;
