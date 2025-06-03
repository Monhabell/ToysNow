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
    async signIn({ user }) {
      try {
        const res = await fetch(`${process.env.API_BASE_URL}/api/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            image: user.image,
            // provieder: 'google' usar en la api para ofrecerle al cliente agregar contraseña
          }),
        });

        if (!res.ok) throw new Error('Fallo en API');

        return true;
      } catch (err) {
        console.error('Error:', err);
        return false;
      }
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: '/',  // Página custom para login
  },
});

export { handler as GET, handler as POST };
