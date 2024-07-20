import { ParentFormProps } from "@/app/page";
import { AppCheckbox } from "@/components/shared/layout/app-checkbox";
import { SubHeading } from "@/components/text/subheading";
import styles from "./review-form.module.scss";
import * as Yup from "yup";
import { isRequired } from "@/app/validation-schema";
import { FormLayout } from "@/components/shared/layout/form-layout";
import React from "react";

interface ReviewFormProps extends ParentFormProps { }
export function ReviewForm(props: ReviewFormProps) {

    return (
        <FormLayout>
            <React.Fragment>
                <SubHeading>Review</SubHeading>
                <p className={styles["heading-text"]}>
                    Review the information to be sure they are accurate and if all is
                    good click the checkbox below and click the button to checkout.
                </p>
            </React.Fragment>
            <React.Fragment>
                <AppCheckbox
                    name="termsAndConditions"
                    label="I agree to the terms and conditions"
                    required={true}
                    validate={isRequired}
                />
            </React.Fragment>
        </FormLayout>
    );
}

export function ReviewFormHeading() {
    return (
        <>
            <SubHeading>Step 4</SubHeading>
            <p>Review the information to be sure they are accurate and if all is good click the checkbox below and click the button to checkout.</p>
        </>
    )
}


ReviewForm.initialValues = {
    termsAndConditions: false,
}
ReviewForm.validationSchema = Yup.object().shape({
    agreement: Yup.boolean().oneOf(
        [true],
        "You must agree to this to continue"
    ),
});