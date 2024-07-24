

// create a simple hook to get the current user

import { getCurrentUser } from "aws-amplify/auth";
import { useEffect, useState } from "react";

export function useGetCurrentUser() {
    const [currentUser, setCurrentUser] = useState<any>(null);
    useEffect(() => {
        getCurrentUser().then((user) => {
            setCurrentUser(user);
        }).catch((error) => {
            setCurrentUser(null);
        });
    }, []);
    return currentUser;
}