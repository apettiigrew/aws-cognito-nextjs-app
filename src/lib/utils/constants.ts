
type Country = { name: string, states: string[] };
export const countries: Country[] = [
    { name: "Nigeria", states: ["Lagos", "Anambra", "Bauchi"] },
    {
        name: "Ghana",
        states: ["Ashanti Region", "Greater Accra Region", "Oti Region"],
    },
    { name: "Brazil", states: ["Acre", "Maranhao", "Parana"] },
    {
        name: "United States of America",
        states: ["California", "Texas", "Oregon"],
    },
    { name: "Australia", states: ["New South Wales", "Victoria", "Queensland"] },
    { name: "Spain", states: ["Barcelona", "Valencia", "Malaga"] },
    { name: "India", states: ["Punjab", "Tamil Nadu", "Kerala"] },
    { name: "Germany", states: ["Bremen", "Hamburg", "Berlin"] },
];

export const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export const cardTypes = ["Verve", "PayPal", "MasterCard", "AMEX", "Discover"];

export const shippingTypes = ["PostNL", "FedEx", "UPS", "Collect in person"];

export const years = [
    "2022",
    "2023",
    "2024",
    "2025",
    "2026",
    "2027",
    "2026",
    "2027",
    "2028",
    "2029",
    "2030",
    "2031",
    "2032",
];

export function optionize<T>(array: T[]) {
    let options = array.map((item) => ({
        label: item,
        value: item,
    }));
    return [{ label: "Click to select", value: "" }, ...options];
};

export const getCountriesOptions = (countries: Country[]) => {
    return optionize(countries.map((country) => country.name));
};

export const propertiesOf = <TObj>(_obj: (TObj | undefined) = undefined) => <T extends keyof TObj>(name: T): T => name;


export enum FormState {
    idle,
    sending,
    success,
    error,
}
