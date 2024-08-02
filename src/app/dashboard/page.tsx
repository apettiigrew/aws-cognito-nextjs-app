"use client";
import { AuthContextProvicer, AuthInfoContext } from "@/components/providers/auth-context";
import { fetchAuthSession, fetchUserAttributes, getCurrentUser, signOut, } from "aws-amplify/auth";
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';


export default function DashboardPage() {
    const router = useRouter();
    const authContext = useContext(AuthInfoContext);
    // console.log(authContext.user);
    useEffect(() => {

        async function handleFetchUserAttributes() {
            try {
                // console.log("fetching user attributes");
                const userAttributes = await fetchUserAttributes();
                const user = await getCurrentUser();
                const authSession = await fetchAuthSession()
                // console.log(userAttributes);
                // console.log(`userAttributes: ${JSON.parse(userAttributes)}`);
                // console.log(`dashboard: ${user}`);
                // console.log(`authSession: ${authSession}`);
            } catch (error) {
                console.log(error);
            }
        }

        handleFetchUserAttributes();
        // getUser();
    }, [])


    function handleLogout() {
        // console.log("logout button clicked");
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