"use client";

import { FormikProps, useFormik } from "formik";
import { useCallback, useState } from "react";

type FormValues = {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
};
const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    address: "",
};
export function MultiStepForm() {
    const [step, setStep] = useState(1);

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            address: "",
        },
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    const nextStep = useCallback(() => setStep((prevStep) => prevStep + 1), []);
    const prevStep = useCallback(() => setStep((prevStep) => prevStep - 1), []);

    return (
        <form onSubmit={formik.handleSubmit}>
            <Content formik={formik} step={step} />
            <div>
                {step > 1 && <button type="button" onClick={prevStep}>Back</button>}
                {step < 3 && <button type="button" onClick={nextStep}>Next</button>}
                {step === 3 && <button type="submit">Submit</button>}
            </div>
        </form>
    )
}
interface ContentProps {
    step: number;
    formik: FormikProps<FormValues>;
}

function Content(props: ContentProps) {
    const { step, formik } = props;

    switch (step) {
        case 1:
            return <PersonalDetailsForm formik={formik} />;
        case 2:
            return <AddressForm formik={formik} />;
        // case 3:
        //     return <Step3 formik={formik} />;
        default:
            return null;;
    }

}
interface PersonalDetailsFormProps {
    formik: FormikProps<FormValues>;
}
function PersonalDetailsForm(props: PersonalDetailsFormProps) {
    const { formik } = props;
    return (
        <div>
            <label htmlFor="firstName">FirstName</label>
            <input
                id="firstName"
                name="firstName"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.firstName}
            />

            <label htmlFor="lastName">Last Name</label>
            <input
                id="lastName"
                name="lastName"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.lastName}
            />

            <label htmlFor="email">Email Address</label>
            <input
                id="email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                value={formik.values.email}
            />
        </div>
    )
}

interface AddressFormProps {
    formik: FormikProps<FormValues>;
}
function AddressForm(props: AddressFormProps) {
    const { formik } = props;
    return (
        <div>
            <label htmlFor="address">Street Address</label>
            <input
                id="address"
                name="address"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.address}
            />


        </div>
    )
}