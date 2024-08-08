import ConfigureAuthCognitoApi from "@/components/providers/auth-cognito";
import { AuthContextProvicer } from "@/components/providers/auth-context";
import CheckForValidConfigurationValues from "@/components/providers/config-checker";
import { DeviceInfoProvider } from "@/components/providers/device-info-provider";
import AmplifyCognitoConfig from "@/lib/auth/amplify-cognito-config";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./../styles/main.scss";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <CheckForValidConfigurationValues>    {/* Confiure imporant .env vars check */}
          <ConfigureAuthCognitoApi>           {/* Configure AWS Cognito for  OAuth2.0 Social Login */}
            <AmplifyCognitoConfig />          {/* Configure AWS Amplify for user pool sign up and sign in */}
            <DeviceInfoProvider>              {/* Simple Device Manager to help manage browser window size and styling */}
              <AuthContextProvicer>           {/* Simple Auth Context Provider to help manage state */}
                {children}
                <ToastContainer />            {/* Toastify for notifications */}
              </AuthContextProvicer>
            </DeviceInfoProvider>
          </ConfigureAuthCognitoApi>
        </CheckForValidConfigurationValues>
      </body>
    </html>
  );

}
