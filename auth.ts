import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";
import { Adapter} from "next-auth/adapters";
import { prisma } from "@/lib/db";
import { getUserById } from "@/lib/user";
import { generateCustomId } from "./lib/utils";

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
      const user = await prisma.user.findUnique({
        where: {
          email: data.email,
        },
        select: {
          name: true,
          emailVerified: true,
        },
      });
      if (user) {
        // 如果用户再次登录 则把deleted改为false
        return prisma.user.update({
          where: {
            email: data.email,
          },
          data: {
            ...data,
            deleted: false,
          },
        });
      }

      const userCount = await prisma.user.count();
      console.log("userCount", userCount);
      console.log("default createUser", data);
      const userId = generateCustomId(userCount+1);
      console.log("custom createUser", userId);
      return prisma.user.create({
        data: {
          ...data,
          id: userId,
        },
      });
    },
    // createUser: async (data: any) => {
    //   console.log("default createUser", data);
    //   data.id = generateCustomId();
    //   console.log("custom createUser", data);
    //   return prisma.user.create({ data });
    // },
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
