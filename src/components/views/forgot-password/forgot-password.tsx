"use client";

import { AWSCognitoCommonError, AWSCognitoError, AWSInitiateAuthError } from "@/lib/auth/cognito-api";
import { getErrorMessage } from "@/lib/get-error-message";
import { resendSignUpCode, signIn, signInWithRedirect } from "aws-amplify/auth";
import { Form, Formik, FormikValues } from "formik";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import * as Yup from "yup";
import { GoogleIcon, WarningIcon } from "../../shared/icons/icons";
import { AppButton, AppButtonVariation } from "../../shared/layout/buttons";
import { InputField } from "../../shared/layout/input-field";
import { Heading, SubHeading } from "../../text/subheading";
import styles from "./forgot-password.module.scss";
import Link from "next/link";

type SigninErrorTypes = AWSCognitoCommonError | "Unknown" | null;
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

export function ForgotPasswordView() {
    const [formstate, setFormState] = useState("initial");
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
            if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
                await resendSignUpCode({
                    username: String(values.email),
                });
                redirectLink = "/confirm-signup";
            }

            router.push(redirectLink);
        } catch (error: unknown) {
            const e = error as AWSInitiateAuthError;
            switch (e.name) {
                case "NotAuthorizedException":
                    setErrorCode("NotAuthorizedException");
                    break;
                default: {
                    setErrorCode("Unknown");
                }
            }

            // return getErrorMessage(error);
        }
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
                            <Formik
                                className={styles["form-container"]}
                                initialValues={initialValues}
                                onSubmit={onSubmitHandler}
                                validateOnMount={true}
                                validationSchema={SignInSchema}>
                                {
                                    (formik: FormikValues) => (
                                        <>
                                            <ErrorMessageBanner errorCode={errorCode} />
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
                                                    <p>Forget Password</p>
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
                            <Link className={styles["create-account-link"]} href={"/sign-up"}>
                                <p>Create an account</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}


interface ErrorMessageBannerProps {
    errorCode: SigninErrorTypes;
}
function ErrorMessageBanner(props: ErrorMessageBannerProps) {
    const { errorCode } = props;
    let message = "";
    console.log(errorCode);
    if (errorCode === null || errorCode === undefined) {
        return null;
    }

    switch (errorCode) {
        case "NotAuthorizedException":
            message = "Incorrect credentials, please try again"
            break;
        case "Unknown":
            message = "Something went wrong please try again later"
    }

    return (
        <div className={styles["error-banner"]}>
            <WarningIcon />
            <p>{message}</p>
        </div>
    )
}