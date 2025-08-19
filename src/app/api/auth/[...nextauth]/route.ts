import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";


// Extiende tipos personalizados
declare module "next-auth" {
  interface Session {
    apiToken?: string;
    userId?: string | number;
  }
  interface User {
    apiToken?: string;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.API_TENANT_BASE_URL_V1}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-Key": process.env.API_KEY || "",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
              device_name: "WebApp",
            }),
          });

          const data = await res.json();

          if (!res.ok || !data.user) {
            throw new Error(data.message || "Credenciales inválidas");
          }

          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            image: data.user.image || null,
            apiToken: data.token,
          };
        } catch (err) {
          console.error("Error en login de credenciales:", err);
          throw new Error("Error en el servidor o credenciales inválidas");
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const res = await fetch(`${process.env.API_BASE_URL}/api/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
            }),
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Fallo en API Google");
          }

          const data = await res.json();

          if (account) {
            account.apiToken = data.token;
          }

          return true;
        } catch (err) {
          console.error("Error en Google login:", err);
          // Lanza error para redirigir a la página de error
          throw new Error("No se pudo iniciar sesión con Google. Intenta más tarde.");
        }
      }

      return true;
    },

    async jwt({ token, user, account }) {
      if (account?.apiToken) {
        token.apiToken = account.apiToken;
      }
      if (user?.apiToken) {
        token.apiToken = user.apiToken;
      }
      if (user?.id) {
        token.userId = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      session.apiToken = token.apiToken;
      session.userId =
        typeof token.userId === "string" || typeof token.userId === "number"
          ? token.userId
          : undefined;
      return session;
    },
  },

  pages: {
    signIn: "/",
    error: "/auth/error", // 👈 página de error personalizada
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 día
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
