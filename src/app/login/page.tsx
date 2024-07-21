"use client";
import { useContext, useMemo } from "react";
import { DeviceInfoContext } from "@/components/providers/device-info-provider";
import { BreakpointPlatform } from "@/lib/css-vars";
import { Heading, SubHeading } from "@/components/text/subheading";
import { AppContainer } from "@/components/shared/layout/app-container";
import { AppSection } from "@/components/shared/layout/app-section";
import styles from "./page.module.scss"
import { InputField } from "@/components/shared/layout/input-field";
import { AppButton, AppButtonVariation } from "@/components/shared/layout/buttons";
import { Formik } from "formik";
import { GoogleIcon } from "@/components/shared/icons/icons";
import { RenderIf } from "@/lib/render-if";

const initialValues = {
    email: "",
    password: "",
}

export default function LoginPage() {
    const deviceInfoContext = useContext(DeviceInfoContext);

    const isMobile = useMemo(() => {
        switch (deviceInfoContext.breakPoint) {
            case BreakpointPlatform.phone:
            case BreakpointPlatform.tabletPortrait:
                return true;
            case BreakpointPlatform.tabletLandscape:
            case BreakpointPlatform.desktopSmall:
            case BreakpointPlatform.desktop:
            case BreakpointPlatform.highRes:
                return false;
            default:
                return false;
        }
    }, [deviceInfoContext.breakPoint]);
    // const isMobile = deviceInfoContext.breakPoint <= BreakpointPlatform.tabletPortrait;

    return (
        <>
            <RenderIf isTrue={isMobile}>
                <MobileLoginView />
            </RenderIf>

            <RenderIf isTrue={!isMobile}>
                <DesktopLoginView />
            </RenderIf>

        </>
    );
}

interface MobileLoginViewProps {

}
function MobileLoginView() {
    return (
        <AppSection id="sign-in" className={styles.root}>
            <AppContainer>
                <div className={styles.container}>
                    <SubHeading className={styles.heading}>Login</SubHeading>
                    <div>
                        <Formik
                            initialValues={initialValues}
                            onSubmit={() => { }}
                            validateOnMount={true}
                        >
                            {(formik) => (
                                <>
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

                                    <div className={styles["horizontal-line"]}>
                                        <hr className={styles.line} />
                                        <small className={"border-text"}>or</small>
                                        <hr className={styles.line} />
                                    </div>
                                    <AppButton
                                        // disabled={!sValid}
                                        type="button"
                                        ariaLabel="Submit button"
                                        variation={AppButtonVariation.primaryWhiteBorder}
                                        className={styles["button-with-icon"]}
                                    // onClick={() => { handleSubmit(formik) }}
                                    >
                                        <GoogleIcon className={styles["button-icon"]} />
                                        Continue With Google
                                    </AppButton>
                                </>
                            )}

                        </Formik>
                    </div>
                </div>
            </AppContainer>
        </AppSection>
    )
}

function DesktopLoginView() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles["left-content"]}>
                        <div className={styles["glass-container"]}>
                            <Heading className={styles["left-content-heading"]} headingElement={1}>
                                It is a shame when the soul is first to give way in this life, and the body does not give way.
                            </Heading>
                            <p style={{ color: "white" }}>Marcus Aurelius</p>

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

                                            <div className={styles["horizontal-line"]}>
                                                <hr className={styles.line} />
                                                <small className={"border-text"}>or</small>
                                                <hr className={styles.line} />
                                            </div>
                                            <AppButton
                                                // disabled={!sValid}
                                                type="button"
                                                ariaLabel="Submit button"
                                                variation={AppButtonVariation.primaryWhiteBorder}
                                                className={styles["button-with-icon"]}
                                            // onClick={() => { handleSubmit(formik) }}
                                            >
                                                <GoogleIcon className={styles["button-icon"]} />
                                                Continue With Google
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