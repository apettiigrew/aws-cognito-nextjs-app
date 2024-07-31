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
import Image from "next/image";
import cityImg from "@img/city.jpg";
import { MessageBanner } from "@/components/shared/layout/banner/message-banner";
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
                        <div className={styles["left-content-img-wrapper"]}>
                            <Image className={styles["background-image"]} src={cityImg} alt="Image of CN Tower, Toronto" />
                        </div>

                        <div className={styles["left-content-text-overlay"]}>
                            <Heading className={styles["left-content-heading"]} headingElement={1}>
                                It's ok we've got you covered
                            </Heading>
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
                                            <MessageBanner state="error" errorCode={errorCode} />
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