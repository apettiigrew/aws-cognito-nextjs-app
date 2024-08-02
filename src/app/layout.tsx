import { DeviceInfoProvider } from "@/components/providers/device-info-provider";
import ConfigureAmplifyClientSide from "@/lib/auth/amplify-cognito-config";
import { Inter } from "next/font/google";
import { AuthContextProvicer } from "@/components/providers/auth-context";
import { ToastContainer } from "react-toastify";
import "./../styles/main.scss";
import 'react-toastify/dist/ReactToastify.css';
import ConfigureAuthCognitoApi from "@/components/providers/auth-cognito";
import CheckForValidConfigurationValues from "@/components/providers/config-checker";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
  return (
    <CheckForValidConfigurationValues>
      <html lang="en">
        <body className={inter.className}>

          <ConfigureAuthCognitoApi />
          <ConfigureAmplifyClientSide />
          
          <DeviceInfoProvider>
            <AuthContextProvicer>
              {children}
              <ToastContainer />
            </AuthContextProvicer>
          </DeviceInfoProvider>
        </body>
      </html>
    </CheckForValidConfigurationValues>

  );
}
