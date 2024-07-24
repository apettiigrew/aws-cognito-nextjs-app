import { DeviceInfoProvider } from "@/components/providers/device-info-provider";
import "./../styles/main.scss";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ConfigureAmplifyClientSide from "@/lib/auth/amplify-cognito-config";


const inter = Inter({ subsets: ["latin"] });



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
