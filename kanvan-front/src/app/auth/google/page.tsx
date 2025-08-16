"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function GoogleAuth() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");

  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      setError("No se recibió código de Google OAuth");
      return;
    }

    async function login() {
      try {
        const res = await axios.post("http://localhost:3001/auth/google", {
          code,
          redirectUri: "http://localhost:3000/auth/google/",
        });

        console.log("Respuesta backend Google:", res.data);
        setResult(res.data);

        // Guarda el token en localStorage
        if (res.data?.accessToken) {
          localStorage.setItem("accessToken", res.data.accessToken);
        }

        // Opcional: guarda usuario en localStorage (si quieres)
        if (res.data?.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }

        // Redirige según rol
        const role = res.data.user?.role?.toLowerCase();

        if (role === "owner") {
          router.push("/main/main-frame");
        } else if (role === "developer") {
          router.push("/main/main-frame-dev");
        }
      } catch (e: any) {
        console.error(
          "Error al autenticar con backend:",
          e.response?.data || e.message
        );
        setError(e.response?.data?.message || "Error en autenticación");
      }
    }

    login();
  }, [code, router]);

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "auto",
        paddingTop: 50,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>Google OAuth Callback</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <div>
          <h3>Usuario logueado:</h3>
          <p>Id: {result.user.userId}</p>
          <p>Nombre: {result.user.name}</p>
          <p>Email: {result.user.email}</p>
          <p>Role: {result.user.role}</p>
          {result.user.image && (
            <img src={result.user.image} alt="avatar" width={80} />
          )}
          <p>
            <strong>Token (JWT):</strong> <br />
            <textarea
              readOnly
              rows={4}
              style={{ width: "100%" }}
              value={result.accessToken}
            />
          </p>
          <Link href="/">Volver al inicio</Link>
        </div>
      )}
      {!result && !error && <p>Autenticando...</p>}
    </div>
  );
}
