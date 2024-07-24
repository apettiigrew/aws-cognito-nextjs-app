"use client";

import { AWSInitiateAuthError } from "@/lib/auth/cognito-api";
import { getErrorMessage } from "@/lib/get-error-message";
import { resendSignUpCode, signIn, signInWithRedirect } from "aws-amplify/auth";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import * as Yup from "yup";
import { GoogleIcon } from "../shared/icons/icons";
import { AppButton, AppButtonVariation } from "../shared/layout/buttons";
import { InputField } from "../shared/layout/input-field";
import { Heading, SubHeading } from "../text/subheading";
import styles from "./login-view.module.scss";

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

export function DesktopLoginView() {

    const [errorCode, setErrorCode] = useState<string | null>(null);
    const router = useRouter();

    const onSubmitHandler = useCallback(async (values: FormValues) => {
        let redirectLink = "/dashboard";
        try {
            const { isSignedIn, nextStep } = await signIn({
                username: String(values.email),
                password: String(values.password),
            });
            if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
                await resendSignUpCode({
                    username: String(values.email),
                });
                redirectLink = "/confirm-signup";
            }
        } catch (error: unknown) {
            // error.name = "AWSCognitoError";
            const e = error as AWSInitiateAuthError;

            switch (e.name) {
                case "NotAuthorizedException":
                    setErrorCode("NotAuthorizedException");
                    break;
                default: {
                    setErrorcode("UnknownError");
                }
            }



            console.log(e.name);
            console.log(e.code);
            return getErrorMessage(error);
        }

        router.push(redirectLink);
    }, []);

    const federatedSignInHandler = useCallback(async () => {
        try {
            signInWithRedirect({ provider: "Google" });
            // redirect("/dashboard");
        } catch (error) {
            return getErrorMessage(error);
        }
    }, []);
    
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles["left-content"]}>
                        <div className={styles["glass-container"]}>
                            <Heading className={styles["left-content-heading"]} headingElement={1}>
                                It is a shame when the soul is first to give way in this life, and the body does not give way.
                            </Heading>
                            <SubHeading style={{ color: "white" }}>Marcus Aurelius</SubHeading>
                        </div>
                    </div>
                    <div className={styles["right-content"]}>
                        <div className={styles.container}>
                            <SubHeading className={styles["desktop-heading"]}>Hey, Hello 👋</SubHeading>
                            <div>
                                <Formik
                                    initialValues={initialValues}
                                    onSubmit={onSubmitHandler}
                                    validateOnMount={true}
                                    validationSchema={SignInSchema}
                                >
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
                                        <p>Forget Password</p>
                                        <AppButton
                                            type="submit"
                                            ariaLabel="Submit button"
                                            variation={AppButtonVariation.primaryDefault}
                                            className={styles["login-button"]}
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
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}