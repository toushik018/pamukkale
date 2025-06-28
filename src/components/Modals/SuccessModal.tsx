"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal = ({ isOpen, onClose }: SuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <motion.div
              key="modal-content"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative transform overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl
                       p-8 text-left shadow-2xl transition-all duration-200 
                       border border-white/20
                       sm:my-8 sm:w-full sm:max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 text-gray-400 
                          hover:text-gray-500 hover:bg-gray-100 transition-all"
              >
                <X className="h-5 w-5" />
              </motion.button>

              {/* Success Icon */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center">
                <div className="relative">
                  {/* Animated ring */}
                  <div className="absolute -inset-3">
                    <div className="h-full w-full rotate-180 transform rounded-full bg-gradient-to-r from-first to-first/60 opacity-30 blur-lg" />
                  </div>
                  {/* Icon container */}
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-first to-first/80">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="mt-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Erfolgreich gesendet!
                </h3>
                <div className="mt-3">
                  <p className="text-gray-600">
                    Vielen Dank für Ihre Nachricht. Wir werden uns innerhalb von
                    24 Stunden bei Ihnen melden.
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="w-full inline-flex items-center justify-center rounded-xl 
                           bg-gradient-to-r from-first to-first/80
                           px-6 py-4 text-base font-semibold text-black
                           shadow-lg shadow-first/20
                           transition-all duration-200
                           hover:shadow-xl hover:shadow-first/30
                           hover:scale-[1.01]
                           focus:outline-none focus:ring-2 focus:ring-first/20"
                >
                  Verstanden
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
