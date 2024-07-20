import * as Yup from "yup";

// export const validationSchema = Yup.object().shape({
//     firstName: Yup.string().required("Please enter your first name").min(2, "Must be at least 2 characters").max(20, 'Must be 20 characters or less'),
//     lastName: Yup.string().required("Please enter your last name").min(2, "Must be at least 2 characters").max(20, 'Must be 20 characters or less'),
//     email: Yup.string().email().required("Please enter your email"),
//     phone: Yup.string()
// });
// validation.ts
export const validateFirstName = (value: string) => {
    let error;
    if (!value) {
        error = "Please enter your first name";
    } else if (value.length < 2) {
        error = "Must be at least 2 characters";
    } else if (value.length > 20) {
        error = "Must be 20 characters or less";
    }
    return error;
};
export const validateLastName = (value: string) => {
    let error;
    if (!value) {
        error = "Please enter your last name";
    } else if (value.length < 2) {
        error = "Must be at least 2 characters";
    } else if (value.length > 20) {
        error = "Must be 20 characters or less";
    }
    return error;
};

// validation.ts
export const validateEmail = (value: string) => {
    let error;
    if (!value) {
        error = "Please enter your email";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
        error = "Invalid email address";
    }
    return error;
};

export const validatePhoneNumber = (value: string) => {
    let error;
    if (!value) {
        error = "Please enter your phone number";
    } else if (!/^[0-9]{10}$/.test(value)) {
        error = "Please enter a valid phone number";
    }
    return error;
};

export const validateShippingAddress = (value: string) => {
    let error;
    if (!value) {
        error = "Please enter a street address";
    } else if (value.length < 2) {
        error = "Must be at least 2 characters";
    } else if (value.length > 20) {
        error = "Must be 20 characters or less";
    }
    return error;
};

export const validateCountry = (value: string) => {
    let error;
    if (!value) {
        error = "Please select a country";
    }
    return error;
};

export const validateState = (value: string) => {
    let error;
    if (!value) {
        error = "Please select a country";
    }
    return error;
};

export const validatePostalCode = (value: any) => {
    let error;
    if (typeof value !== 'string') {
        error = 'Postal code must be a string';
    }
    if (!value) {
        error = "Please enter a postal code";
    }

    return error;
};

export const validateShippingMethod = (value: any) => {
    let error;
    if (!value) {
        error = "Please enter a postal code";
    }
    return error;
};

export const validateCardType = (value: any) => {
    let error;
    if (!value) {
        error = "Please select a card type";
    }
    return error;
};

export const isRequired = (value: any) => {
    let error;
    if (!value) {
        error = "Please enter a value";
    }
    return error;
};



export const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("Please enter your first name").min(2, "Must be at least 2 characters").max(20, 'Must be 20 characters or less'),
    lastName: Yup.string().required("Please enter your last name").min(2, "Must be at least 2 characters").max(20, 'Must be 20 characters or less'),
    email: Yup.string().email().required("Please enter your email"),
    phoneNumber: Yup.string().matches(/^[0-9]{10}/, "Please enter a valid phone number"),
    streetAddress: Yup.string().required("Please enter a street address").min(2, "Must be at least 2 characters").max(100, 'Must be 100 characters or less'),
    country: Yup.string().required("Please select a country").min(2),
    state: Yup.string().required("Please select a state"),
    postalCode: Yup.string(),
    shippingMethod: Yup.string().required("Please select shipping method"),
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
    agreement: Yup.boolean().oneOf(
        [true],
        "You must agree to this to continue"
    ),
});