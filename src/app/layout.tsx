import { DeviceInfoProvider } from "@/components/providers/device-info-provider";
import ConfigureAmplifyClientSide from "@/lib/auth/amplify-cognito-config";
import { Inter } from "next/font/google";
import { AuthContextProvicer } from "@/components/providers/auth-context";
import { ToastContainer } from "react-toastify";
import "./../styles/main.scss";
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DeviceInfoProvider>
          <ConfigureAmplifyClientSide />
          <AuthContextProvicer>
            {children}
            <ToastContainer />
          </AuthContextProvicer>
        </DeviceInfoProvider>
      </body>
    </html>
  );
}
