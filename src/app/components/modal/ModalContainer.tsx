import { useModalStore } from "@/stores/useModalStore";
import { useEffect, useRef } from "react";
import LoginSignupForm from "../LoginSignUpForm";
import { ErrorModal } from "./ErrorModal";
import { SaveModal } from "./SaveModal";

export const ModalContainer = () => {
    const { closeModal, modalContents, modalType } = useModalStore();

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                closeModal();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
                className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
                ref={modalRef}
            >
                <button
                    onClick={closeModal}
                    className="float-right text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                    &times;
                </button>
                {modalType === "error" && (
                    <ErrorModal
                        message={modalContents as string}
                        title="Error"
                    />
                )}
                {modalType === "login" && (
                    <LoginSignupForm onClose={closeModal} />
                )}
                {modalType === "save" && <SaveModal />}
                {modalType === "custom" && modalContents}
            </div>
        </div>
    );
};

