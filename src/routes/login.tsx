import { createFileRoute, useNavigate } from "@tanstack/react-router";
import LoginSignupForm from "../app/components/LoginSignUpForm";
import { useAuthStore } from "@/stores/useAuthStore";


export const Route = createFileRoute("/login")({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    if (user) {
        navigate({ to: "/" });
    }

    return (
        <div className="container mx-auto px-4 flex justify-center items-center h-noheader-screen">
            <LoginSignupForm />
        </div>
    );
}

