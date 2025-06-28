import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface SelectedProduct {
  id: string | null;
  categoryName: string | null;
}

interface ExtraState {
  selectedProduct: SelectedProduct;
  isAddingExtra: boolean;
  error: string | null;
  showModal: boolean;
  isExtraMode: boolean;
}

const initialState: ExtraState = {
  selectedProduct: {
    id: null,
    categoryName: null
  },
  isAddingExtra: false,
  error: null,
  showModal: false,
  isExtraMode: false
};

const extraSlice = createSlice({
  name: "extra",
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<SelectedProduct>) => {
      state.selectedProduct = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = initialState.selectedProduct;
    },
    setIsAddingExtra: (state, action: PayloadAction<boolean>) => {
      state.isAddingExtra = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    showExtraModal: (state) => {
      state.showModal = true;
    },
    hideExtraModal: (state) => {
      state.showModal = false;
    },
    setExtraMode: (state, action: PayloadAction<boolean>) => {
      if (state.selectedProduct.categoryName === "Extras") {
        state.isExtraMode = false;
        return;
      }
      state.isExtraMode = action.payload;
    }
  }
});

// Selectors
export const selectSelectedProduct = (state: RootState) => state.extra.selectedProduct;
export const selectIsAddingExtra = (state: RootState) => state.extra.isAddingExtra;
export const selectError = (state: RootState) => state.extra.error;
export const selectShowModal = (state: RootState) => state.extra.showModal;
export const selectIsExtraMode = (state: RootState) => state.extra.isExtraMode;

export const {
  setSelectedProduct,
  clearSelectedProduct,
  setIsAddingExtra,
  setError,
  showExtraModal,
  hideExtraModal,
  setExtraMode
} = extraSlice.actions;

export default extraSlice.reducer; 