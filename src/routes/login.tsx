import { createFileRoute, useNavigate } from "@tanstack/react-router";
import LoginSignupForm from "../app/components/LoginSignUpForm";
import { useAuth } from "../lib/useAuth";

export const Route = createFileRoute("/login")({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const { user } = useAuth();

    if (user) {
        navigate({ to: "/" });
    }

    return (
        <div className="container mx-auto px-4 flex justify-center items-center h-noheader-screen">
            <LoginSignupForm />
        </div>
    );
}

