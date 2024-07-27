"use client";

import { AWSCognitoCommonError } from "@/lib/auth/cognito-api";
import { resetPassword } from "aws-amplify/auth";
import { Form, Formik, FormikValues } from "formik";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import * as Yup from "yup";
import { WarningIcon } from "../../../shared/icons/icons";
import { AppButton, AppButtonVariation } from "../../../shared/layout/buttons";
import { InputField } from "../../../shared/layout/input-field";
import { Heading, SubHeading } from "../../../text/subheading";
import styles from "./forgot-password.module.scss";
import { toast } from "react-toastify";

type SigninErrorTypes = AWSCognitoCommonError | "Unknown" | null;
interface FormValues {
    email: string;
}

const initialValues: FormValues = {
    email: "",
}

const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Please enter your email'),
});

export function ForgotPasswordSubmitView() {
    const [errorCode, setErrorCode] = useState<SigninErrorTypes>(null);
    const router = useRouter();

    const onSubmitHandler = useCallback(async (values: FormValues) => {
        try {
            await resetPassword({ username: String(values["email"]) });
            toast.success("Forgot password code sent!", {
                position: "top-right"
            });
            router.push("/forgot-password/confirm");
        } catch (error: unknown) {

        }
    }, []);

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles["left-content"]}>
                        <div className={styles["glass-container"]}>
                            <Heading className={styles["left-content-heading"]} headingElement={1}>
                                It's ok, we got you covered.
                            </Heading>
                            {/* <SubHeading style={{ color: "white" }}>Marcus Aurelius</SubHeading> */}
                        </div>
                    </div>
                    <div className={styles["right-content"]}>
                        <div className={styles.container}>
                            <Formik
                                className={styles["form-container"]}
                                initialValues={initialValues}
                                onSubmit={onSubmitHandler}
                                validateOnMount={true}
                                validationSchema={ForgotPasswordSchema}>
                                {
                                    (formik: FormikValues) => (
                                        <>
                                            <ErrorMessageBanner errorCode={errorCode} />
                                            <SubHeading className={styles["desktop-heading"]}>Forgot password?</SubHeading>
                                            <p>Enter your email address and we’ll send you a code to reset your password.</p>
                                            <div>
                                                <Form>
                                                    <InputField
                                                        type="text"
                                                        name="email"
                                                        label="Email"
                                                        required={true}
                                                    />

                                                    <AppButton
                                                        type="submit"
                                                        ariaLabel="Submit button"
                                                        variation={AppButtonVariation.primaryDefault}
                                                        className={styles["login-button"]}
                                                        disabled={formik.isSubmitting}
                                                    >
                                                        Send Password Reset Code
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