import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import bcrypt from "bcrypt";
import loginModel from "../../../src/commons/libraries/login.model";
import { dbConnectLogin } from "../../../src/commons/libraries/dbConnect";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign-in form (e.g., 'Sign in with...')
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error("Missing credentials");
        }

        const conn = await dbConnectLogin();
        const Login = loginModel(conn);

        const user = await Login.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found");
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordMatch) {
          throw new Error("Invalid password");
        }

        // Any user object returned here will be saved in the JSON Web Token
        return { email: user.email, name: user.name, theme: user.theme };
      },
    }),
  ],
  // Add session, JWT and database options here if necessary
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
});
