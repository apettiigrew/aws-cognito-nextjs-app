"use client";
import { GoogleIcon } from "@/components/shared/icons/icons";
import { AppButton, AppButtonVariation } from "@/components/shared/layout/buttons";
import { InputField } from "@/components/shared/layout/input-field";
import { Heading, SubHeading } from "@/components/text/subheading";
import { Form, Formik } from "formik";
import styles from "./page.module.scss";
import { useCallback } from "react";
import * as Yup from "yup";

interface FormValues {
    code: string;
}
const initialValues: FormValues = {
    code: "",
}
const ConfirmCodeSchema = Yup.object().shape({
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

    const onSubmitHandler = useCallback(async (values: FormValues) => {

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