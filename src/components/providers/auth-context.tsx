"use client";
import { createContext, useCallback, useState } from "react";

export interface AuthState {
    /** The email that user is using to login or signup */
    email: string;
    /** Determines if the user is authenticated or not */
    isAuthenticated: boolean;
    /** Determines if the user is in the sign up flow */
    isConfirmingSignup: boolean;

    setAuthenticatedState: (value: boolean) => void;
    setEmail: (value: string) => void;
    setIsConfirmingSignup: (value: boolean) => void;
}

const defaultState: AuthState = {
    email: '',
    isAuthenticated: false,
    isConfirmingSignup: false,
    setAuthenticatedState: () => { },
    setEmail: () => { },
    setIsConfirmingSignup: () => { },
};

export const AuthInfoContext = createContext<AuthState>(defaultState);

interface AuthContextProviderProps {
    children: React.ReactNode;
}
export function AuthContextProvicer(props: AuthContextProviderProps) {
    const { children } = props;
    const [email, setEmail] = useState<string>("");
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isConfirmingSignup, setIsConfirmingSignup] = useState<boolean>(false);

    return (
        <AuthInfoContext.Provider value={{
            email,
            isAuthenticated,
            isConfirmingSignup,
            setAuthenticatedState: setIsAuthenticated,
            setEmail: setEmail,
            setIsConfirmingSignup: setIsConfirmingSignup
        }}>
            {children}
        </AuthInfoContext.Provider>
    )
}