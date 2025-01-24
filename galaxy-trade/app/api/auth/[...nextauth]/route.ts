import { getUserByUsername } from "@/lib/actions";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        //
        if (!credentials?.username) {
          return null;
        }
        const response = await getUserByUsername(credentials.username);
        console.log({ response });

        if (!response) {
          return null;
        }

        const user = response.rows[0];
        const passwordCorrect = await compare(
          credentials.password || "",
          user.password
        );

        if (passwordCorrect) {
          return {
            id: user.id,
            username: user.username,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
