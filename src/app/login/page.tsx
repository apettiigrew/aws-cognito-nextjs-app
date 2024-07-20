"use client";
import { useContext } from "react";
import { DeviceInfoContext } from "@/components/providers/device-info-provider";
import { BreakpointPlatform } from "@/lib/css-vars";
import { SubHeading } from "@/components/text/subheading";
import { AppContainer } from "@/components/shared/layout/app-container";
import { AppSection } from "@/components/shared/layout/app-section";
import styles from "./page.module.scss"
import { InputField } from "@/components/shared/layout/input-field";
import { AppButton, AppButtonVariation } from "@/components/shared/layout/buttons";
import { Form, Formik } from "formik";

const initialValues = {
    email: "",
    password: "",
}

export default function LoginPage() {
    const deviceInfoContext = useContext(DeviceInfoContext);
    const isMobile = deviceInfoContext.breakPoint === BreakpointPlatform.phone;
    return (
        <AppSection id="sign-in" className={styles.root}>
            <AppContainer>
                <Formik
                    initialValues={initialValues}
                    onSubmit={() => { }}
                    validateOnMount={true}
                >
                    <Form>

                        {isMobile ? <MobileLoginView /> : <DesktopLoginView />}

                        <AppButton
                            // disabled={!sValid}
                            type="button"
                            ariaLabel="Submit button"
                            variation={AppButtonVariation.primaryDefault}
                            className={styles["login-button"]}
                        // onClick={() => { handleSubmit(formik) }}
                        >
                            Login
                        </AppButton>
                    </Form>
                </Formik>
            </AppContainer>
        </AppSection>

    );
}

interface MobileLoginViewProps {

}
function MobileLoginView() {
    return (
        <div className={styles.container}>
            <SubHeading className={styles.heading}>Login</SubHeading>
            <div>
                <InputField
                    // className={styles["form-field"]}
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
                <p>Forget Password</p>
            </div>
        </div>

    )
}

function DesktopLoginView() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles["left-content"]}>
                        some content here
                    </div>
                    <div className={styles["right-content"]}>
                        some content here on teh right side
                    </div>
                </div>
            </div>
        </main>
    )
}