"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useAddExtraMutation } from "@/services/api";
import {
  selectSelectedProduct,
  selectIsAddingExtra,
  setIsAddingExtra,
  setError,
  clearSelectedProduct,
  selectShowModal,
  hideExtraModal,
  setExtraMode,
} from "@/redux/slices/extraSlice";
import { toast } from "sonner";

interface ExtraProductsModalProps {
  onNext: () => void;
}

const ExtraProductsModal: React.FC<ExtraProductsModalProps> = ({ onNext }) => {
  const dispatch = useDispatch();
  const selectedProduct = useSelector(selectSelectedProduct);
  const isAddingExtra = useSelector(selectIsAddingExtra);
  const [addExtra] = useAddExtraMutation();
  const isOpen = useSelector(selectShowModal);

  const handleAddExtra = async () => {
    if (!selectedProduct.id) {
      toast.error("Kein Produkt ausgewählt");
      return;
    }

    dispatch(setIsAddingExtra(true));
    try {
      const response = await addExtra({
        product_id: selectedProduct.id,
      }).unwrap();

      if (response.success) {
        toast.success("Extra erfolgreich hinzugefügt");
        dispatch(clearSelectedProduct());
        dispatch(hideExtraModal());
      }
    } catch (error) {
      console.error("Error adding extra:", error);
      dispatch(setError("Fehler beim Hinzufügen des Extras"));
      toast.error("Fehler beim Hinzufügen des Extras");
    } finally {
      dispatch(setIsAddingExtra(false));
    }
  };

  const handleNext = () => {
    dispatch(hideExtraModal());
    onNext();
  };

  const handleContinueSelecting = () => {
    dispatch(setExtraMode(true));
    dispatch(hideExtraModal());
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50 px-4"
        >
          <motion.div
            key="modal-content"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white rounded-2xl p-10 max-w-lg w-full shadow-[0_8px_40px_rgba(0,0,0,0.06)]"
          >
            {/* Content */}
            <div className="space-y-6">
              {/* Title with divider */}
              <div className="space-y-4">
                <h3 className="text-2xl font-light text-black">
                  Kategorie vollständig
                </h3>
                <div className="h-[1px] w-12 bg-black/10"></div>
              </div>

              <p className="text-base text-black/60 leading-relaxed font-light">
                Sie haben die erforderliche Anzahl an Produkten für diese
                Kategorie ausgewählt. Möchten Sie weitere Produkte hinzufügen
                oder zur nächsten Kategorie wechseln?
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleContinueSelecting}
                  disabled={isAddingExtra}
                  className="flex-1 px-6 py-4 border border-black/10 rounded-xl 
                           font-light text-black hover:bg-black/5
                           transition-colors duration-200 disabled:opacity-50"
                >
                  Weiter auswählen
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 px-6 py-4 bg-black rounded-xl font-light 
                           text-white hover:bg-black/90 transition-colors 
                           duration-200 flex items-center justify-center"
                >
                  Nächste Kategorie
                </button>
              </div>

              {/* Footer note */}
              <p className="text-xs text-black/40 text-center font-light">
                Sie können jederzeit weitere Produkte zu Ihrem Warenkorb
                hinzufügen
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExtraProductsModal;
