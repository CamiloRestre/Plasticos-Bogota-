"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError("No pudimos iniciar sesión. Verifica tu correo y contraseña.");
        return;
      }

      const redirect = searchParams.get("redirect");
      const destination =
        redirect?.startsWith("/") && !redirect.startsWith("//")
          ? redirect
          : "/admin";

      router.push(destination);
      router.refresh();
    } catch {
      setError("Ocurrió un error inesperado. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="admin-login">
      <section className="admin-login-card" aria-labelledby="login-title">
        <div className="admin-login-brand" aria-hidden="true">
          B
        </div>
        <div className="admin-login-heading">
          <p className="eyebrow">Panel privado</p>
          <h1 id="login-title">Bienvenido de vuelta.</h1>
          <p>Ingresa para gestionar el catálogo de Plásticos Bogotá.</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              className="admin-input"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="password">Contraseña</label>
            <input
              className="admin-input"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {error ? (
            <p className="admin-error" role="alert">
              {error}
            </p>
          ) : null}

          <button
            className="admin-btn-primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<main className="admin-login" aria-busy="true" />}>
      <LoginForm />
    </Suspense>
  );
}
