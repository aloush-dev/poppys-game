import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Header } from "../app/components/Header";

export const Route = createRootRoute({
    component: () => (
        <>
            <Header />
            <Outlet />
            {process.env.NODE_ENV === "development" && (
                <TanStackRouterDevtools />
            )}
        </>
    ),
});

