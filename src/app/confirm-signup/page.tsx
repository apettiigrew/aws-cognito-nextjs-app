"use client";
import { GoogleIcon } from "@/components/shared/icons/icons";
import { AppButton, AppButtonVariation } from "@/components/shared/layout/buttons";
import { InputField } from "@/components/shared/layout/input-field";
import { Heading, SubHeading } from "@/components/text/subheading";
import { Form, Formik } from "formik";
import styles from "./page.module.scss";
import { useCallback } from "react";
import * as Yup from "yup";
import { autoSignIn, confirmSignUp } from "aws-amplify/auth";
import { getErrorMessage } from "@/lib/get-error-message";
import { redirect, useRouter } from "next/navigation";

interface FormValues {
    email: string;
    code: string;
}
const initialValues: FormValues = {
    email: "",
    code: "",
}
const ConfirmCodeSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    code: Yup.string().required('Required'),
});

export default function ConfirmSignUpPage() {
    return (
        <>
            <ConfirmSignUpView />
        </>
    );
}

function ConfirmSignUpView() {
    const router = useRouter();
    const onSubmitHandler = useCallback(async (values: FormValues) => {
        try {
            const { isSignUpComplete, nextStep } = await confirmSignUp({
              username: String(values.email),
              confirmationCode: String(values.code),
            });
            await autoSignIn();
          } catch (error) {
            return getErrorMessage(error);
          }
          router.push("/login");
    }, []);

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles["left-content"]}>
                        <div className={styles["glass-container"]}>
                            <Heading className={styles["left-content-heading"]} headingElement={1}>
                                Let's Go, Happy to have you onboard
                            </Heading>
                            {/* <SubHeading style={{ color: "white" }}>Marcus Aurelius</SubHeading> */}
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
                                        <p>Already have an account?</p>
                                        <AppButton
                                            type="submit"
                                            ariaLabel="Submit button"
                                            variation={AppButtonVariation.primaryDefault}
                                            className={styles["login-button"]}>
                                            Confirm Code
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