"use client";

import React from "react";
import { useRouter } from "next/navigation";

export function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-gradient-to-b from-gray-800 via-gray-900 to-black px-4">
      <div className="bg-gray-800 bg-opacity-30 backdrop-blur-md rounded-2xl shadow-lg max-w-md w-full p-8 text-gray-100 font-sans">
        <h2 className="text-3xl font-semibold mb-8 text-center tracking-wide">
          Elige un método de ingresar
        </h2>

        <a
          href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=482130499480-0u8bse0esnmth5tal7pb7oavvmpih6hv.apps.googleusercontent.com&redirect_uri=http://localhost:3000/auth/google/&response_type=code&scope=openid%20profile%20email&access_type=offline&prompt=consent`}
          className="block w-full mb-5 py-3 rounded-xl bg-blue-500 bg-opacity-20 backdrop-blur-sm text-gray-200 text-center font-semibold hover:bg-blue-400 hover:bg-opacity-40 transition-colors duration-300 shadow-md shadow-gray-700"
        >
          Login con Google
        </a>

        <a
          href={`https://github.com/login/oauth/authorize?client_id=Ov23liqqnJMY3JAkrLjq&redirect_uri=http://localhost:3000/auth/github&scope=user:email`}
          className="block w-full py-3 rounded-xl bg-gray-700 bg-opacity-20 backdrop-blur-sm text-gray-200 text-center font-semibold hover:bg-gray-600 hover:bg-opacity-40 transition-colors duration-300 shadow-md shadow-gray-800"
        >
          Login con GitHub
        </a>
      </div>
    </div>
  );
}

export default function App() {
  const router = useRouter();

  return <Login />;
}
