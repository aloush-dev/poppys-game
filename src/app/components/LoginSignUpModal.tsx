import type React from "react";
import LoginSignupForm from "./LoginSignUpForm";

interface ModalLoginSignupProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginSignUpModal: React.FC<ModalLoginSignupProps> = ({
    isOpen,
    onClose,
}) => {
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100"
            onClick={handleBackdropClick}
        >
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                <button
                    onClick={onClose}
                    className="float-right text-gray-500 hover:text-gray-700"
                >
                    &times;
                </button>
                <LoginSignupForm onClose={onClose} />
            </div>
        </div>
    );
};

export default LoginSignUpModal;

