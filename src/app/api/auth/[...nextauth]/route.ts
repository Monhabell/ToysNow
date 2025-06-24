import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
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

        if (!res.ok) throw new Error('Fallo en API');

        const data = await res.json();
        
        // Guardamos el token en el objeto account
        if (account) {
          account.apiToken = data.token;
        }
        
        return true;
      } catch (err) {
        console.error('Error:', err);
        return false;
      }
    },
    async jwt({ token, account }) {
      // Pasamos el token de account al JWT
      if (account?.apiToken) {
        token.apiToken = account.apiToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Pasamos el token del JWT a la sesión
      session.apiToken = token.apiToken;
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };