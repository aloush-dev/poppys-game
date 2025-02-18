import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
    component: LayoutComponent,
});

function LayoutComponent() {
    return (
        <main className="flex-grow container mx-auto px-4 py-8">
            <h1>hello</h1>
            <Outlet />
        </main>
    );
}

