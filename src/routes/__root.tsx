import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Header } from "../app/components/Header";
import { useModalStore } from "@/stores/useModalStore";
import { ModalContainer } from "@/app/components/modal/ModalContainer.tsx";

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    const { modalOpen } = useModalStore();

    return (
        <>
            <Header />
            {modalOpen && <ModalContainer />}
            <Outlet />
            {process.env.NODE_ENV === "development" && (
                <TanStackRouterDevtools />
            )}
        </>
    );
}

