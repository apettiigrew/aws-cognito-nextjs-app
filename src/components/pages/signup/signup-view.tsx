"use client";

import { AuthInfoContext } from "@/components/providers/auth-context";
import { MessageBanner, SigninErrorTypes } from "@/components/shared/layout/banner/message-banner";
import { AppButton, AppButtonVariation } from "@/components/shared/layout/buttons";
import { InputField } from "@/components/shared/layout/input-field";
import { Heading, SubHeading } from "@/components/text/subheading";
import { AWSInitiateAuthError } from "@/lib/auth/cognito-api";
import { propertiesOf } from "@/lib/utils/constants";
import { signUp } from "aws-amplify/auth";
import { Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import styles from "./signup-view.module.scss";
import views from "@img/views.jpg";

const propof = propertiesOf<FormValues>();
interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
const initialValues: FormValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
}
const SignupSchema = Yup.object().shape({
    firstName: Yup.string().required("Please enter your first name").min(2, "Must be at least 2 characters").max(20, 'Must be 20 characters or less'),
    lastName: Yup.string().required("Please enter your last name").min(2, "Must be at least 2 characters").max(20, 'Must be 20 characters or less'),
    email: Yup.string().email().required("Please enter your email"),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-z]+/, "Must contain at least one lowercase character")
        .matches(/[A-Z]+/, "Must contain at least one uppercase character")
        .matches(/[@$!%*#?&]+/, "Must contain at least one special character")
        .required("Please enter your password"),
});

export function SignUpView() {
    const [errorCode, setErrorCode] = useState<SigninErrorTypes>(null);
    const router = useRouter();
    const authContext = useContext(AuthInfoContext);


    const onSubmitHandler = useCallback(async (values: FormValues) => {
        try {
            setErrorCode(null);
            const { isSignUpComplete, userId, nextStep } = await signUp({
                username: String(values.email),
                password: String(values.password),
                options: {
                    userAttributes: {
                        email: String(values.email),
                        name: String(values.firstName) + " " + String(values.lastName),
                        given_name: String(values.firstName),
                        family_name: String(values.lastName),
                    },
                    // optional
                    autoSignIn: true,
                },
            });

            authContext.setEmail(values.email);
            toast.success("Confirmation code sent!", {
                position: "top-right"
            });
            router.push("/confirm-signup");

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
                        <div className={styles["left-content-img-wrapper"]}>
                            <Image className={styles["background-image"]} src={views} alt="Image of a building, Toronto" />
                        </div>

                        <div className={styles["left-content-text-overlay"]}>

                            <Heading className={styles["left-content-heading"]} headingElement={1}>
                                Let's Go, Happy to have you onboard.
                            </Heading>
                            {/* <SubHeading style={{ color: "white" }}>{data?.author}</SubHeading> */}


                        </div>
                    </div>
                    <div className={styles["right-content"]}>
                        <div className={styles.container}>
                            <MessageBanner errorCode={errorCode} state="error" />
                            <SubHeading className={styles["desktop-heading"]}>Welcome, sign up to create an account 🚀</SubHeading>
                            <div>
                                <Formik
                                    initialValues={initialValues}
                                    onSubmit={onSubmitHandler}
                                    validateOnMount={true}
                                    validationSchema={SignupSchema}>
                                    <Form>

                                        <div className={styles["input-group"]}>
                                            <InputField
                                                type="text"
                                                name={propof("firstName")}
                                                label="First Name"
                                                required={true}
                                            />
                                            <InputField
                                                type="text"
                                                name={propof("lastName")}
                                                label="Last Name"
                                                required={true}
                                            />
                                        </div>
                                        <InputField
                                            type="text"
                                            name={propof("email")}
                                            label="Email"
                                            required={true}
                                        />
                                        <InputField
                                            type="password"
                                            name={propof("password")}
                                            label="Password"
                                            required={true}
                                        />

                                        <Link className={styles.link} href="/login">
                                            <p>Already have an account?</p>
                                        </Link>
                                        <AppButton
                                            type="submit"
                                            ariaLabel="Submit button"
                                            variation={AppButtonVariation.primaryDefault}
                                            className={styles["login-button"]}>
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