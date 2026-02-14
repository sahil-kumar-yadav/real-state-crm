import type { NextAuthOptions, DefaultSession } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/* =========================
   Module Augmentation
========================= */

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: "ADMIN" | "AGENT" | "CLIENT";
            firstName?: string | null;
            lastName?: string | null;
            avatar?: string | null;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        role: "ADMIN" | "AGENT" | "CLIENT";
        firstName?: string | null;
        lastName?: string | null;
        avatar?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id?: string;
        role?: "ADMIN" | "AGENT" | "CLIENT";
    }
}

/* =========================
   Auth Options
========================= */

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    throw new Error("Invalid credentials");
                }

                const passwordMatch = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!passwordMatch) {
                    throw new Error("Invalid credentials");
                }

                if (!user.isActive) {
                    throw new Error("User account is inactive");
                }

                // Update last login
                await prisma.user.update({
                    where: { id: user.id },
                    data: { lastLogin: new Date() },
                });

                return {
                    id: user.id,
                    email: user.email,
                    role: user.role as "ADMIN" | "AGENT" | "CLIENT",
                    firstName: user.firstName,
                    lastName: user.lastName,
                    avatar: user.avatar,
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.email = user.email;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id ?? "";
                session.user.role = token.role ?? "CLIENT";
                session.user.email = token.email ?? session.user.email;
            }
            return session;
        },
    },

    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },

    events: {
        async signIn({ user }) {
            console.log(`User ${user.email} signed in`);
        },
        async signOut({ token }) {
            console.log(`User ${token?.email} signed out`);
        },
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
    },

    secret: process.env.NEXTAUTH_SECRET,
};
