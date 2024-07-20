import { ParentFormProps } from "@/app/page";
import { AppSelect } from "@/components/shared/layout/app-select";
import { InputField } from "@/components/shared/layout/input-field";
import { SubHeading } from "@/components/text/subheading";
import styles from "./payment-details-form.module.scss";
import { isRequired, validateCardType } from "@/app/validation-schema";
import * as Yup from "yup";
import { FormLayout } from "@/components/shared/layout/form-layout";
import React from "react";

interface PaymentDetailsFormProps extends ParentFormProps { }
export function PaymentDetailsForm(props: PaymentDetailsFormProps) {

    const cardTypesOptions = [
        { value: 'visa', label: 'Visa' },
        { value: 'mastercard', label: 'MasterCard' },
        { value: 'amex', label: 'American Express' },
        { value: 'discover', label: 'Discover' },
    ];

    const cardExpirationMonths = [
        { value: "1", label: 'January' },
        { value: "2", label: 'February' },
        { value: "3", label: 'March' },
        { value: "4", label: 'April' },
        { value: "5", label: 'May' },
        { value: "6", label: 'June' },
        { value: "7", label: 'July' },
        { value: "8", label: 'August' },
        { value: "9", label: 'September' },
        { value: "10", label: 'October' },
        { value: "11", label: 'November' },
        { value: "12", label: 'December' },
    ];

    const currentYear = new Date().getFullYear();
    const cardExpirationYears = Array.from({ length: 10 }, (_, i) => ({
        value: `${currentYear + i}`,
        label: `${currentYear + i}`,
    }));

    return (
        <FormLayout>
            <React.Fragment>
                <SubHeading>Payment Method</SubHeading>
                <p>Select the payment method.</p>
            </React.Fragment>
            <React.Fragment>
                <AppSelect
                    label="Card Type"
                    name="cardType"
                    required={true}
                    options={cardTypesOptions}
                    placeholder="Click to select card type"
                    validate={validateCardType}
                />

                <InputField
                    type="text"
                    name="cardNumber"
                    label="Card Number"
                    required={true}
                    validate={validateCardType}
                />

                <div className={styles["input-group"]}>
                    <AppSelect
                        label="Expiration Date"
                        name="expirationDate.month"
                        required={true}
                        options={cardExpirationMonths}
                        placeholder="Month"
                        validate={isRequired}
                    />

                    <AppSelect
                        name="expirationDate.year"
                        required={true}
                        options={cardExpirationYears}
                        placeholder="Year"
                        validate={isRequired}
                    />
                </div>

                <InputField
                    type="text"
                    name="cvv"
                    label="CVV Number"
                    required={true}
                    validate={isRequired}
                />
            </React.Fragment>
        </FormLayout>
    )
}

export function PaymentDetailsFormHeading() {
    return (
        <>
            <SubHeading>Step 3</SubHeading>
            <p>Select the payment method</p>
        </>
    )
}

PaymentDetailsForm.initialValues = {
    cardType: "",
    cardNumber: "",
    expireMonthDate: 0,
    expireMonthYear: 0,
    cvv: "",
}

PaymentDetailsForm.validationSchema = Yup.object().shape({
    cardType: Yup.string().required("Please select a card type"),
    cardNumber: Yup.number()
        .typeError("Please enter a valid card number")
        .required("Please select a card number"),
    expirationDate: Yup.object().shape({
        month: Yup.string().required("Please select a month"),
        year: Yup.string().required("Please select a year"),
    }),
    cvv: Yup.number()
        .typeError("Please enter only digits")
        .required("Please enter your CVV Number"),
});