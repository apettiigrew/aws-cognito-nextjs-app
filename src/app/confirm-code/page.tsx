"use client";
import { GoogleIcon } from "@/components/shared/icons/icons";
import { AppButton, AppButtonVariation } from "@/components/shared/layout/buttons";
import { InputField } from "@/components/shared/layout/input-field";
import { Heading, SubHeading } from "@/components/text/subheading";
import { Formik } from "formik";
import styles from "./page.module.scss";

const initialValues = {
    email: "",
    password: "",
}

export default function LoginPage() {
    return (
        <>
            <DesktopLoginView />
        </>
    );
}

function DesktopLoginView() {
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
                                    onSubmit={() => { }}
                                    validateOnMount={true}
                                >
                                    {(formik) => (
                                        <>

                                            <InputField
                                                type="text"
                                                name="confirmationCode"
                                                label="Confirmation Code"
                                                required={true}
                                            // validate={validateFirstName}
                                            />

                                            <p>Already have an account?</p>
                                            <AppButton
                                                // disabled={!sValid}
                                                type="button"
                                                ariaLabel="Submit button"
                                                variation={AppButtonVariation.primaryDefault}
                                                className={styles["login-button"]}
                                            // onClick={() => { handleSubmit(formik) }}
                                            >
                                                Confirm
                                            </AppButton>



                                        </>
                                    )}

                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}