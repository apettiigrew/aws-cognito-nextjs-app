"use client";
import { AppButton, AppButtonVariation } from "@/components/shared/layout/buttons";
import { InputField } from "@/components/shared/layout/input-field";
import { Heading, SubHeading } from "@/components/text/subheading";
import { Form, Formik } from "formik";
import { useCallback } from "react";
import * as Yup from 'yup';
import styles from "./page.module.scss";
import { signUp } from "aws-amplify/auth";
import { getErrorMessage } from "@/lib/get-error-message";
import { redirect } from "next/navigation";

interface FormValues {
    email: string;
    password: string;
    name: string;
}
const initialValues: FormValues = {
    name: "",
    email: "",
    password: "",
}
const SignupSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
});


export default function SignUpPage() {
    return (
        <>
            <DesktopSignUpView />
        </>
    );
}

function DesktopSignUpView() {
    const onSubmitHandler = useCallback(async (values: FormValues) => {
        try {
            const { isSignUpComplete, userId, nextStep } = await signUp({
                username: String(values.email),
                password: String(values.password),
                options: {
                    userAttributes: {
                        email: String(values.email),
                        name: String(values.name),
                    },
                    // optional
                    autoSignIn: true,
                },
            });
        } catch (error) {
            return getErrorMessage(error);
        }
        redirect("/confirm-signup");
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
                                    validationSchema={SignupSchema}>
                                    <Form>
                                        <InputField
                                            type="text"
                                            name="name"
                                            label="Name"
                                            required={true}
                                        // validate={validateFirstName}
                                        />
                                        {/* <InputField
                                                type="text"
                                                name="lastName"
                                                label="Last Name"
                                                required={true}
                                            // validate={validateFirstName}
                                            /> */}

                                        <InputField
                                            type="text"
                                            name="email"
                                            label="Email"
                                            required={true}
                                        // validate={validateFirstName}
                                        />
                                        <InputField
                                            type="password"
                                            name="password"
                                            label="Password"
                                            required={true}
                                        // validate={validateFirstName}
                                        />

                                        <p>Already have an account?</p>
                                        <AppButton
                                            type="submit"
                                            ariaLabel="Submit button"
                                            variation={AppButtonVariation.primaryDefault}
                                            className={styles["login-button"]}
                                        // onClick={onSubmitHandler}
                                        >
                                            Sign Up
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