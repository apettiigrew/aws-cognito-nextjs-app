"use client";

import { AWSCognitoCommonError, AWSCognitoError, AWSInitiateAuthError } from "@/lib/auth/cognito-api";
import { getErrorMessage } from "@/lib/get-error-message";
import { confirmResetPassword, resendSignUpCode, signIn, signInWithRedirect } from "aws-amplify/auth";
import { Form, Formik, FormikValues } from "formik";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import * as Yup from "yup";
import { GoogleIcon, WarningIcon } from "../../../shared/icons/icons";
import { AppButton, AppButtonVariation } from "../../../shared/layout/buttons";
import { InputField } from "../../../shared/layout/input-field";
import { Heading, SubHeading } from "../../../text/subheading";
import styles from "./forgot-password-confirm.module.scss";
import Link from "next/link";
import { MessageBanner } from "@/components/shared/layout/banner/message-banner";

type SigninErrorTypes = AWSCognitoCommonError | "Unknown" | null;
interface FormValues {
    email: string;
    password: string;
    // confirmNewPassword: string;
    code: string;
}

const initialValues: FormValues = {
    email: "",
    password: "",
    code: "",
}

const SignInSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Please enter your email'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-z]+/, "Must contain at least one lowercase character")
        .matches(/[A-Z]+/, "Must contain at least one uppercase character")
        .matches(/[@$!%*#?&]+/, "Must contain at least one special character")
        .required('Please enter a password'),
    code: Yup.string().matches(/^[0-9]/, "Invalid code").required('Code is required'),
});

export function ForgotPasswordConfirmView() {
    const [errorCode, setErrorCode] = useState<SigninErrorTypes>(null);
    const router = useRouter();

    const onSubmitHandler = useCallback(async (values: FormValues) => {
        try {
            const link = "/login";
            await confirmResetPassword({
                username: String(values["email"]),
                confirmationCode: String(values["code"]),
                newPassword: String(values["password"]),
            });
            router.push(link);
        } catch (error: unknown) {
            const e = error as AWSInitiateAuthError;
            setErrorCode(e.name);
        }
    }, []);

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.content}>

                    <div className={styles.container}>
                        <Link href="/">
                            <p>Back</p>
                        </Link>
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
                                        <SubHeading className={styles["desktop-heading"]}>Enter password reset details</SubHeading>
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
                                                    label="New Password"
                                                    required={true}
                                                />
                                                <InputField
                                                    type="text"
                                                    name="code"
                                                    label="Confirmation Code"
                                                    required={true}
                                                />
                                                <AppButton
                                                    type="submit"
                                                    ariaLabel="Submit button"
                                                    variation={AppButtonVariation.primaryDefault}
                                                    className={styles["login-button"]}
                                                    disabled={formik.isSubmitting}>
                                                    Save
                                                </AppButton>
                                            </Form>
                                        </div>
                                    </>
                                )
                            }
                        </Formik>
                    </div>
                </div>
            </div>
        </main>
    )
}