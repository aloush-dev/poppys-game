import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Header } from "../app/components/Header";
import LoginSignUpModal from "../app/components/LoginSignUpModal";
import { useState } from "react";

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Header onLoginClick={() => setIsModalOpen(true)} />
            <LoginSignUpModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <Outlet />
            {process.env.NODE_ENV === "development" && (
                <TanStackRouterDevtools />
            )}
        </>
    );
}

