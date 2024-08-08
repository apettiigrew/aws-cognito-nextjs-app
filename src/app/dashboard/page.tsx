"use client";
import { AuthInfoContext } from "@/components/providers/auth-context";
import { AppButton, AppButtonVariation } from "@/components/shared/layout/buttons";
import { Heading } from "@/components/text/subheading";
import { CognitoAPI } from "@/lib/auth/cognito-api";
import { fetchUserAttributes, FetchUserAttributesOutput, signOut } from "aws-amplify/auth";
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useEffect, useState } from 'react';
import styles from './page.module.scss';
import { clearCustomerAccessTokenCookie } from "@/lib/cookies/cookie-utils";

export default function DashboardPage() {
    const router = useRouter();
    const authContext = useContext(AuthInfoContext);
    const [user, setUser] = useState<FetchUserAttributesOutput>();
    useEffect(() => {

        async function handleFetchUserAttributes() {
            try {
                if (CognitoAPI.userSessionIsValid) {
                    setUser({
                        name: CognitoAPI.getUserAttribute("given_name") || "",
                        email: CognitoAPI.getUserAttribute("email") || ""
                    })
                } else {
                    const userAttributes = await fetchUserAttributes();
                    setUser(userAttributes);
                }
            } catch (error) {
                console.log(error);
            }
        }

        handleFetchUserAttributes();
        // getUser();
    }, [])

    const federatedSignOut = useCallback(() => {
        clearCustomerAccessTokenCookie();
        router.push('/login');
    }, [router]);

    function handleLogout() {

        if (CognitoAPI.userSessionIsValid) {
            CognitoAPI.signOutUser(federatedSignOut)
        } else {
            signOut().then(() => {
                router.push('/login');
            }
            ).catch((error) => {
                router.push('/login');
            });
        }
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