import { DeviceInfoProvider } from "@/components/providers/device-info-provider";
import "./../styles/main.scss";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ConfigureAmplifyClientSide from "@/lib/amplify-cognito-config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  creator: 'Andrew Pettigrew',
  authors: [{ name: 'Andrew Pettigrew', url: 'https://www.linkedin.com/in/andrewpettigrew/' }],
  title: "Login Page",
  description: "An nextjs app that uses AWS Cognito for authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DeviceInfoProvider>
          <ConfigureAmplifyClientSide />
          {children}
        </DeviceInfoProvider>
      </body>
    </html>
  );
}
