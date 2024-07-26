"use client";

import { AppButton, AppButtonVariation } from "@/components/shared/layout/buttons";
import { InputField } from "@/components/shared/layout/input-field";
import { Heading, SubHeading } from "@/components/text/subheading";
import { getErrorMessage } from "@/lib/get-error-message";
import { confirmSignUp, autoSignIn } from "aws-amplify/auth";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import * as Yup from "yup";
import styles from "./confirm-signpu.module.scss";
import { MessageBanner, SigninErrorTypes } from "@/components/shared/layout/banner/message-banner";
import { AWSInitiateAuthError } from "@/lib/auth/cognito-api";

interface FormValues {
    email: string;
    code: string;
}
const initialValues: FormValues = {
    email: "",
    code: "",
}
const ConfirmCodeSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Please enter your email'),
    code: Yup.string().required('Please enter a valid code'),
});

export function ConfirmSignUpView() {
    const [errorCode, setErrorCode] = useState<SigninErrorTypes>(null);
    const router = useRouter();
    const onSubmitHandler = useCallback(async (values: FormValues) => {
        try {
            setErrorCode(null);
            const { isSignUpComplete, nextStep } = await confirmSignUp({
                username: String(values.email),
                confirmationCode: String(values.code),
            });
            await autoSignIn();
            router.push("/login");
        } catch (error) {
            const e = error as AWSInitiateAuthError;
            setErrorCode(e.name);
        }

    }, []);

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles["left-content"]}>
                        <div className={styles["glass-container"]}>
                            <Heading className={styles["left-content-heading"]} headingElement={1}>
                                Let's get confirmed
                            </Heading>
                            {/* <SubHeading style={{ color: "white" }}>Marcus Aurelius</SubHeading> */}
                        </div>
                    </div>
                    <div className={styles["right-content"]}>
                        <div className={styles.container}>
                            <MessageBanner errorCode={errorCode} state="error" />
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
                                            className={styles["login-button"]}>
                                            Confirm Account
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