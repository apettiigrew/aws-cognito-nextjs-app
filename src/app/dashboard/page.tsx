"use client";
import { AuthContextProvicer, AuthInfoContext } from "@/components/providers/auth-context";
import { Heading } from "@/components/text/subheading";
import { fetchAuthSession, fetchUserAttributes, FetchUserAttributesOutput, getCurrentUser, signOut, } from "aws-amplify/auth";
import { useRouter } from 'next/navigation';
import { use, useContext, useEffect, useState } from 'react';
import styles from './page.module.scss';
import { AppButton, AppButtonVariation } from "@/components/shared/layout/buttons";

export default function DashboardPage() {
    const router = useRouter();
    const authContext = useContext(AuthInfoContext);
    const [user, setUser] = useState<FetchUserAttributesOutput>();
    useEffect(() => {

        async function handleFetchUserAttributes() {
            try {

                const userAttributes = await fetchUserAttributes();
                setUser(userAttributes);
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
        <main className={styles.main}>
            <div className={styles.container}>
                <Heading className={styles.heading} headingElement={1}>
                    Welcome, {user?.name}
                </Heading>
                <p>{user?.email}</p>

                <AppButton
                    type="button"
                    ariaLabel="Logout button"
                    variation={AppButtonVariation.primaryDefault}
                    className={styles.button}
                    onClick={handleLogout}>
                    Logout
                </AppButton>
            </div>
        </main>
    )
}