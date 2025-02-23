import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../firebase/config";

interface AuthContextProps {
    user: User | null;
    setUser: (user: User | null) => void;
    logOut: () => void;
}

export const AuthContext = createContext<AuthContextProps | null>({
    user: null,
    setUser: () => {},
    logOut: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const logOut = () => {
        signOut(auth);
        setUser(null);
    };

    useEffect(() => {
        onAuthStateChanged(auth, setUser);
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

