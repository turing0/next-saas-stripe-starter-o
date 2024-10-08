import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";
import { Adapter} from "next-auth/adapters";
import { prisma } from "@/lib/db";
import { getUserById } from "@/lib/user";
import { generateCustomId, generateUserId } from "./lib/utils";

// More info: https://authjs.dev/getting-started/typescript#module-augmentation
declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  // adapter: PrismaAdapter(prisma),
  adapter: {
    ...PrismaAdapter(prisma),
    createUser: async (data) => {
      console.log("default createUser", data);
      // const userId = generateCustomId(userCount+1);
      // const userId = generateUserId(data.email);

      let userId: string;
      let user: any;
      let attempts = 0;
      const maxAttempts = 3;
      while (!user && attempts < maxAttempts) {
        try {
          userId = generateUserId(data.email);
          user = await prisma.user.create({
            data: {
              ...data,
              id: userId,
            },
          });
    
          console.log("User created successfully:", user);
          return user;
        } catch (error) {
          if ((error as any).code === 'P2002') {
            console.log("Duplicate ID detected, retrying...");
            attempts++;
          } else {
            throw error;
          }
        }
      }

      console.log("All attempts failed, using cuid as userId");
      return prisma.user.create({
        data: {
          ...data,
          id: crypto.randomUUID(),
        },
      });
    },
  } as Adapter,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    // error: "/auth/error",
  },
  callbacks: {
    async session({ token, session }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }

        if (token.email) {
          session.user.email = token.email;
        }

        if (token.role) {
          session.user.role = token.role;
        }

        session.user.name = token.name;
        session.user.image = token.picture;
      }

      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const dbUser = await getUserById(token.sub);

      if (!dbUser) return token;

      token.name = dbUser.name;
      token.email = dbUser.email;
      token.picture = dbUser.image;
      token.role = dbUser.role;

      return token;
    },
  },
  // events: {
  //   async createUser({ user }) {
  //     const customId = generateCustomId();
  //     await prisma.user.update({
  //       where: { id: user.id },
  //       data: { id: customId },
  //     });
  //   },
  // },
  ...authConfig,
  // debug: process.env.NODE_ENV !== "production"
});
