"use client";

import { AuthInfoContext } from "@/components/providers/auth-context";
import { MessageBanner, SigninErrorTypes } from "@/components/shared/layout/banner/message-banner";
import { AppButton, AppButtonVariation } from "@/components/shared/layout/buttons";
import { InputField } from "@/components/shared/layout/input-field";
import { SubHeading } from "@/components/text/subheading";
import { AWSInitiateAuthError } from "@/lib/auth/cognito-api";
import { autoSignIn, confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useState } from "react";
import * as Yup from "yup";
import styles from "./confirm-signup.module.scss";

interface FormValues {
    email: string;
    code: string;
}

const ConfirmCodeSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Please enter your email'),
    code: Yup.string().required('Please enter a valid code'),
});

export function ConfirmSignUpView() {
    const authContext = useContext(AuthInfoContext);
    const [errorCode, setErrorCode] = useState<SigninErrorTypes>(null);
    const router = useRouter();

    const initialValues: FormValues = {
        email: authContext.email,
        code: "",
    }

    const onSubmitHandler = useCallback(async (values: FormValues) => {
        try {
            setErrorCode(null);
            const { isSignUpComplete, nextStep } = await confirmSignUp({
                username: String(values.email),
                confirmationCode: String(values.code),
            });
            await autoSignIn();
            router.push("/dashboard");
        } catch (error) {
            const e = error as AWSInitiateAuthError;
            setErrorCode(e.name);
        }

    }, []);

    const resendConfirmationCodeHandler = useCallback(async () => {
        try {
            const { email } = initialValues;
            await resendSignUpCode({
                username: String(authContext.email),
            });
        } catch (error) {
            const e = error as AWSInitiateAuthError;
            setErrorCode(e.name);
        }
    }, []);

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.container}>
                        <MessageBanner errorCode={errorCode} state="error" />
                        <SubHeading>Confirm account</SubHeading>
                        <p>Check your email for the confirmation code</p>
                        <div>
                            <Formik
                                initialValues={initialValues}
                                onSubmit={onSubmitHandler}
                                validateOnMount={true}
                                validationSchema={ConfirmCodeSchema}>
                                <Form>
                                    <InputField
                                        type="text"
                                        name="email"
                                        label="Email"
                                        required={true}
                                        disabled={true}
                                    />
                                    <InputField
                                        type="text"
                                        name="code"
                                        label="Confirmation Code"
                                        required={true}
                                    />
                                    <p className={styles["confirmation-code"]} onClick={resendConfirmationCodeHandler}>Resend  confirmation code</p>
                                    <AppButton
                                        type="submit"
                                        ariaLabel="Submit button"
                                        variation={AppButtonVariation.primaryDefault}
                                        className={styles["login-button"]}>
                                        Confirm Account
                                    </AppButton>
                                </Form>
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}