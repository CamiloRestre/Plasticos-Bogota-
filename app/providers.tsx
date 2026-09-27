"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60_000, refetchOnWindowFocus: false },
    },
  }));

  return <QueryClientProvider client={queryClient}>{children}<Toaster position="top-right" toastOptions={{ style: { background: "var(--forest)", color: "var(--white)", border: "1px solid rgba(255,255,255,.2)" } }} /></QueryClientProvider>;
}
