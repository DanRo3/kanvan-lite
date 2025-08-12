"use client";

type JWTClaims = {
  exp?: number;
  iat?: number;
  role?: string;
  [key: string]: any;
};

// Obtener token del localStorage
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

// Guardar token en localStorage
export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("accessToken", token);
};

// Eliminar token del localStorage
export const removeToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
};

// Decodificar JWT sin verificar firma (solo para uso cliente)
export const decodeJWT = (token: string): JWTClaims | null => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) throw new Error("Invalid JWT format");

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

// Obtener claims del token actual
export const getCurrentClaims = (): JWTClaims | null => {
  const token = getToken();
  return token ? decodeJWT(token) : null;
};

// Verificar expiración del token
export const isTokenExpired = (): boolean => {
  const claims = getCurrentClaims();
  if (!claims?.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return claims.exp < currentTime;
};

// Función completa de verificación
export const validateToken = (): boolean => {
  if (typeof window === "undefined") return false;
  const token = getToken();

  if (!token) return false;
  if (isTokenExpired()) {
    removeToken();
    return false;
  }

  return true;
};
