"use client";
import { GoogleIcon } from "@/components/shared/icons/icons";
import { AppButton, AppButtonVariation } from "@/components/shared/layout/buttons";
import { InputField } from "@/components/shared/layout/input-field";
import { Heading, SubHeading } from "@/components/text/subheading";
import { Formik, FormikValues } from "formik";
import styles from "./page.module.scss";
import { useCallback } from "react";
import { signIn } from "aws-amplify/auth";

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

// interface MobileLoginViewProps {

// }
// function MobileLoginView() {
//     return (
//         <AppSection id="sign-in" className={styles.root}>
//             <AppContainer>
//                 <div className={styles.container}>
//                     <SubHeading className={styles.heading}>Login</SubHeading>
//                     <div>
//                         <Formik
//                             initialValues={initialValues}
//                             onSubmit={() => { }}
//                             validateOnMount={true}
//                         >
//                             {(formik) => (
//                                 <>
//                                     <InputField
//                                         // className={styles["form-field"]}
//                                         type="text"
//                                         name="email"
//                                         label="Email"
//                                         required={true}
//                                     // validate={validateFirstName}
//                                     />
//                                     <InputField
//                                         type="password"
//                                         name="password"
//                                         label="Password"
//                                         required={true}
//                                     // validate={validateFirstName}
//                                     />
//                                     <p>Forget Password</p>
//                                     <AppButton
//                                         // disabled={!sValid}
//                                         type="button"
//                                         ariaLabel="Submit button"
//                                         variation={AppButtonVariation.primaryDefault}
//                                         className={styles["login-button"]}
//                                     // onClick={() => { handleSubmit(formik) }}
//                                     >
//                                         Login
//                                     </AppButton>

//                                     <div className={styles["horizontal-line"]}>
//                                         <hr className={styles.line} />
//                                         <small className={"border-text"}>or</small>
//                                         <hr className={styles.line} />
//                                     </div>
//                                     <AppButton
//                                         // disabled={!sValid}
//                                         type="button"
//                                         ariaLabel="Submit button"
//                                         variation={AppButtonVariation.primaryWhiteBorder}
//                                         className={styles["button-with-icon"]}
//                                     // onClick={() => { handleSubmit(formik) }}
//                                     >
//                                         <GoogleIcon className={styles["button-icon"]} />
//                                         Continue With Google
//                                     </AppButton>
//                                 </>
//                             )}

//                         </Formik>
//                     </div>
//                 </div>
//             </AppContainer>
//         </AppSection>
//     )
// }

function DesktopLoginView() {

    const onSubmitHandler = useCallback(async (values: FormikValues) => {
        let redirectLink = "/dashboard";
        console.log(values);
        try {
            // const { isSignedIn, nextStep } = await signIn({
               
            //     username: String(formData.get("email")),
            //     password: String(formData.get("password")),
            // });
            // if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
            //     await resendSignUpCode({
            //         username: String(formData.get("email")),
            //     });
            //     redirectLink = "/auth/confirm-signup";
            // }
        } catch (error) {
            // return getErrorMessage(error);
        }

        // redirect(redirectLink);
    }, []);

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles["left-content"]}>
                        <div className={styles["glass-container"]}>
                            <Heading className={styles["left-content-heading"]} headingElement={1}>
                                It is a shame when the soul is first to give way in this life, and the body does not give way.
                            </Heading>
                            <SubHeading style={{ color: "white" }}>Marcus Aurelius</SubHeading>
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