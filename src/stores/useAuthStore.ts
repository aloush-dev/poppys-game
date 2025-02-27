import { create } from "zustand";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    User,
} from "firebase/auth";
import { auth } from "@/firebase/config";

interface AuthStore {
    user: null | User;
    loading: boolean;

    setUser: (user: User | null) => void;

    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<User>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    loading: true,

    setUser: (user) => set({ user, loading: false }),

    signIn: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );
            set({ user: userCredential.user });
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    },

    signUp: async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );
            set({ user: userCredential.user });
            return userCredential.user;
        } catch (error) {
            console.error("Signup failed", error);
            throw error;
        }
    },

    logout: async () => {
        await signOut(auth);
        set({ user: null });
    },
}));

onAuthStateChanged(auth, (user) => {
    useAuthStore.getState().setUser(user);
});

