// next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface Session {
    apiToken?: string;
  }
  
  interface JWT {
    apiToken?: string;
  }
  
  interface Account {
    apiToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    apiToken?: string;
  }
}