
import { DesktopLoginView } from "@/components/views/login-view";
import { Metadata } from "next";

export const metadata: Metadata = {
    creator: 'Andrew Pettigrew',
    authors: [{ name: 'Andrew Pettigrew', url: 'https://www.linkedin.com/in/andrewpettigrew/' }],
    title: "Login Page",
    description: "An nextjs app that uses AWS Cognito for authentication",
};

export default function LoginPage() {
    return (
        <>
            <DesktopLoginView />
        </>
    );
}

