import { isValidUrl } from "@/lib/utils/url-utils";


interface Props {
    children: React.ReactNode;
}
export default function CheckForValidConfigurationValues(props: Props) {
    const { children } = props;

    if (!isValidUrl(process.env.NEXT_PUBLIC_BASE_APP_URL)) {
        console.error("Invalid NEXT_PUBLIC_APP_BASEURL in env! Please make sure it is valid.");
        return null;
    }

    if (typeof process.env.NEXT_PUBLIC_USER_POOL_ID !== "string") {
        console.error("Invalid NEXT_PUBLIC_USER_POOL_ID in env! Please make sure it is valid.");
        return null;
    }

    if (typeof process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID !== "string") {
        console.error("Invalid NEXT_PUBLIC_COGNITO_APP_CLIENT_ID in env! Please make sure it is valid.");
        return null;
    }

    if (typeof process.env.NEXT_PUBLIC_OAUTH_DOMAIN_H !== "string") {
        console.error("Invalid NEXT_PUBLIC_OAUTH_DOMAIN_H in env! Please make sure it is valid.");
        return null;
    }

    if (typeof process.env.NEXT_PUBLIC_OAUTH_DOMAIN !== "string") {
        console.error("Invalid NEXT_PUBLIC_COGNITO_HOSTED_UI_BASE_URL in env! Please make sure it is valid.");
        return null;
    }

    return children;
}