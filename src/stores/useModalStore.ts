import { ReactNode } from "react";
import { create } from "zustand";

type ModalType = "custom" | "error" | "login" | "save" | "publish";
interface ModalState {
    modalType: ModalType | null;
    modalOpen: boolean;
    modalContents?: ReactNode | null;
    closeModal: () => void;
    openModal: (type: ModalType, content?: ReactNode | string) => void;
}

export const useModalStore = create<ModalState>((set) => ({
    modalType: null,
    modalOpen: false,
    modalContents: null,

    closeModal: () =>
        set({ modalOpen: false, modalContents: null, modalType: null }),

    openModal: (type: ModalType, content: ReactNode | string) =>
        set({ modalOpen: true, modalContents: content, modalType: type }),
}));

