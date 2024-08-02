"use client";

import { MessageBanner, SigninErrorTypes } from "@/components/shared/layout/banner/message-banner";
import { CognitoAPI, setThirdPartyAuthorizeRedirectData } from "@/lib/auth/cognito-api";
import { getErrorMessage } from "@/lib/get-error-message";
import cnTowerImg from "@img/cn-tower.jpg";
import { resendSignUpCode, signIn } from "aws-amplify/auth";
import { Form, Formik, FormikValues } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import * as Yup from "yup";
import { GoogleIcon } from "../../shared/icons/icons";
import { AppButton, AppButtonVariation } from "../../shared/layout/buttons";
import { InputField } from "../../shared/layout/input-field";
import { Heading, SubHeading } from "../../text/subheading";
import styles from "./login-view.module.scss";
import { AWSInitiateAuthError, CognitoIdpSignInUrlBuildResult } from "@/lib/auth/cognito-api-types";

interface FormValues {
    email: string;
    password: string;
}

const initialValues: FormValues = {
    email: "",
    password: "",
}

const SignInSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Please enter your email'),
    password: Yup.string().required('Required'),
});

export function LoginView() {

    const [errorCode, setErrorCode] = useState<SigninErrorTypes>(null);
    const router = useRouter();

    const onSubmitHandler = useCallback(async (values: FormValues) => {
        try {
            setErrorCode(null);
            let redirectLink = "/dashboard";
            const { isSignedIn, nextStep } = await signIn({
                username: String(values.email),
                password: String(values.password),
            });

            console.log(isSignedIn, nextStep);
            if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
                await resendSignUpCode({
                    username: String(values.email),
                });
                redirectLink = "/confirm-signup";
            }

            router.push(redirectLink);
        } catch (error: unknown) {
            const e = error as AWSInitiateAuthError;
            console.log(e);
            switch (e.name) {
                case "NotAuthorizedException":
                    setErrorCode("NotAuthorizedException");
                    break;
                default: {
                    setErrorCode("Unknown");
                }
            }
        }
    }, []);

    const onCognitoIdpSignInBuildResult = useCallback((result: CognitoIdpSignInUrlBuildResult) => {
        if (result.success) {
            window.location.assign(result.url);
        } else {
            setErrorCode("InternalErrorException");
        }
    }, []);

    const federatedSignInHandler = useCallback(async () => {

        try {
            /**
             * This is a more straightfoward way to sign in with Google.
             * In order to get user information that was signed invovled listen in to 
             * signInWithRedirect event in the Hub. 
             * 
             * There is ongoing bug apparently with the signInWithRedirect event not firing.
             * https://github.com/aws-amplify/amplify-js/issues/13436
             * 
             * So I have opted for a different approach until the issue has been resolved.
             * 
             */
            /** signInWithRedirect({ provider: "Google" }); */

            const baseUrl = process.env.NEXT_PUBLIC_BASE_APP_URL;
            const successRedirect = new URL(baseUrl + "/dashboard");
            const errorRedirect = new URL(baseUrl + "/login?err_code=something-went-wrong");

            const success = setThirdPartyAuthorizeRedirectData(
                successRedirect,
                errorRedirect,
                "GOOGLE",
            );

            if (!success)
                throw new Error("Failed to set third party authorize redirect data!");

            const redirectUri = new URL('/third-party-authorize/', baseUrl).toString();

            CognitoAPI.buildIdpSignInUrl({
                provider: "Google",
                redirectUri: redirectUri,
            }, onCognitoIdpSignInBuildResult);

        } catch (error) {
            return getErrorMessage(error);
        }
    }, [onCognitoIdpSignInBuildResult]);

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles["left-content"]}>
                        <div className={styles["left-content-img-wrapper"]}>
                            <Image className={styles["background-image"]} src={cnTowerImg} alt="Image of CN Tower, Toronto" priority={true} />
                        </div>

                        <div className={styles["left-content-text-overlay"]}>
                            <Heading className={styles["left-content-heading"]} headingElement={1}>
                                You must lay aside the burdens of the mind; until you do this, no place will satisfy you.
                            </Heading>
                            <SubHeading style={{ color: "white" }}>Seneca</SubHeading>
                        </div>
                    </div>
                    <div className={styles["right-content"]}>
                        <div className={styles.container}>
                            <Formik
                                className={styles["form-container"]}
                                initialValues={initialValues}
                                onSubmit={onSubmitHandler}
                                validateOnMount={true}
                                validationSchema={SignInSchema}>
                                {
                                    (formik: FormikValues) => (
                                        <>
                                            <MessageBanner state="error" errorCode={errorCode} />
                                            <SubHeading className={styles["desktop-heading"]}>Hey, Hello 👋</SubHeading>
                                            <div>
                                                <Form>
                                                    <InputField
                                                        type="text"
                                                        name="email"
                                                        label="Email"
                                                        required={true}
                                                    />
                                                    <InputField
                                                        type="password"
                                                        name="password"
                                                        label="Password"
                                                        required={true}
                                                    />
                                                    <Link href={"/forgot-password/submit"}><p>Forget Password</p></Link>

                                                    <AppButton
                                                        type="submit"
                                                        ariaLabel="Submit button"
                                                        variation={AppButtonVariation.primaryDefault}
                                                        className={styles["login-button"]}
                                                        disabled={formik.isSubmitting}
                                                    >
                                                        Login
                                                    </AppButton>

                                                    <div className={styles["horizontal-line"]}>
                                                        <hr className={styles.line} />
                                                        <small className={"border-text"}>or</small>
                                                        <hr className={styles.line} />
                                                    </div>
                                                    <AppButton
                                                        // disabled={!sValid}
                                                        type="button"
                                                        ariaLabel="Submit button"
                                                        variation={AppButtonVariation.primaryWhiteBorder}
                                                        className={styles["button-with-icon"]}
                                                        onClick={federatedSignInHandler}
                                                    >
                                                        <GoogleIcon className={styles["button-icon"]} />
                                                        Continue With Google
                                                    </AppButton>
                                                </Form>
                                            </div>
                                        </>
                                    )
                                }
                            </Formik>
                            <Link className={styles["create-account-link"]} href={"/signup"}>
                                <p>Create an account</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

