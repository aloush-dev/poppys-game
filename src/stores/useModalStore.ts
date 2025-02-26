import { create } from "zustand";

interface ModalState {
    modal: string | null;
    setModal: (modal: string) => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalState>((set, get) => ({
    modal: null,
    setModal: (modal) => set({ modal }),
    closeModal: () => set({ modal: null }),
}));

