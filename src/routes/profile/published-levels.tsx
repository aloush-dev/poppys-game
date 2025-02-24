import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/published-levels")({
    loader: async () => {},
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/profile/published-levels"!</div>;
}

