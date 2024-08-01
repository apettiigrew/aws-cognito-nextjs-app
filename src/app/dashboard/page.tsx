"use client";
import { fetchUserAttributes, getCurrentUser, signOut } from "aws-amplify/auth";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        async function handleFetchUserAttributes() {
            try {
                console.log("fetching user attributes");
                const userAttributes = await fetchUserAttributes();
                const user = await getCurrentUser();
                console.log(userAttributes);
                console.log(user);
            } catch (error) {
                console.log(error);
            }
        }

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