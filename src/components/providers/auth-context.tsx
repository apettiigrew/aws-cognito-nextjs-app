"use client";
import { getCurrentUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { createContext, useCallback, useEffect, useState } from "react";

export interface AuthState {
    user: any;
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
    user: null,
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
    const [user, setUser] = useState<any>(null)
    const [email, setEmail] = useState<string>("");
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isConfirmingSignup, setIsConfirmingSignup] = useState<boolean>(false);

    useEffect(() => {
        Hub.listen('auth', ({ payload: { event } }) => {
            console.log("hub event", event)
            switch (event) {
                case "signInWithRedirect":
                    console.log("signInWithRedirect event")
                    checkUser()
                    break
                case "signedOut":
                    setUser(null)
                    break
            }
        })
        checkUser()
    }, [])

    Hub.listen('auth', (data) => {
        switch (data.payload.event) {
            case "signedOut":
                setUser(null)
                break
            default:
                break
        }
    })

    const checkUser = async () => {
        try {
            // const responseUser = await currentAuthenticatedUser()
            const responseUser = await getCurrentUser()
            setUser(responseUser)
        } catch (error) {
            setUser(null)
        }
    }

    const isFederatedSignIn = useCallback(async () => {

    }, [])

    return (
        <AuthInfoContext.Provider value={{
            user: user,
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