import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Extiende el tipo User para incluir apiToken
declare module "next-auth" {
  interface Session {
    apiToken?: string;
    userId?: string | number; // Asegúrate que coincida con el tipo de ID
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
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.API_TENANT_BASE_URL_V1}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': process.env.API_KEY || '',
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
            apiToken: data.token, // 👈 se usará más abajo
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
      // No toques Google, ya lo tienes bien
      if (account?.provider === 'google') {
        try {
          const res = await fetch(`${process.env.API_BASE_URL}/api/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
            }),
          });

          if (!res.ok) throw new Error('Fallo en API Google');

          const data = await res.json();

          // Guarda token de tu backend
          if (account) {
            account.apiToken = data.token;
          }

          return true;
        } catch (err) {
          console.error('Error en Google login:', err);
          return false;
        }
      }

      // Para login con credenciales ya se retorna true por defecto si authorize() devuelve un usuario
      return true;
    },

    async jwt({ token, user, account }) {

      // Google o Credentials
      if (account?.apiToken) {
        token.apiToken = account.apiToken;
      }
      if (user?.apiToken) {
        token.apiToken = user.apiToken;
      }

      // Guardar ID del usuario
      if (user?.id) {
        token.userId = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      session.apiToken = token.apiToken;
      session.userId = typeof token.userId === "string" || typeof token.userId === "number" ? token.userId : undefined; // 👈 Añadimos esto
      return session;
    },
  },

  pages: {
    signIn: '/',
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
