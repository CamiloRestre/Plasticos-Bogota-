declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SECRET_KEY: string;
    NEXT_PUBLIC_WHATSAPP_NUMBER: string;
  }
}
