"use client";
import { useGetCurrentUser } from '@/hooks/use-get-current-user';
import { fetchUserAttributes, getCurrentUser, signOut } from "aws-amplify/auth";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function DashboardPage() {
    const router = useRouter();

    async function handleFetchUserAttributes() {
        try {
            const userAttributes = await fetchUserAttributes();
            console.log(userAttributes);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleFetchUserAttributes();
        // getUser();
    }, [])


    function handleLogout() {
        console.log("button clicked");
        signOut().then(() => {
            router.push('/login');
        }
        ).catch((error) => {
            router.push('/login');
        });
    }

    return (
        <div>
            <p>Dashboard page</p>
            {/* <p>{user}</p> */}
            {/* <p>{userId}</p> */}
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}