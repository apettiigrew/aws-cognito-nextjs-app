import { NextServer, createServerRunner } from "@aws-amplify/adapter-nextjs";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth/server";
import { authConfig } from "./amplify-cognito-config";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: {
    Auth: authConfig,
  },
});

export async function authenticatedUser(context: NextServer.Context) {
  return await runWithAmplifyServerContext({
    nextServerContext: context,
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        
        if (!session.tokens) {
          return null;
        }
        const user = {
          ...(await getCurrentUser(contextSpec)),
        };
        
        return user;
      } catch (error) {
        return null;
      }
    },
  });
}
