"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { isValidRut } from "@/lib/rut";

export function AuthForm({ mode }: { mode: "login" | "register" | "forgot" }) {
  const router = useRouter(); const [error, setError] = useState("");
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const email = String(form.get("email"));
    if (!email.toLowerCase().endsWith("@gmail.com")) return setError("Usa una dirección terminada en @gmail.com.");
    if (mode === "register" && !isValidRut(String(form.get("rut")))) return setError("El RUT ingresado no es válido.");
    if (mode === "forgot") return setError("Si la cuenta existe, enviaremos instrucciones al Gmail registrado.");
    localStorage.setItem("savia-user", JSON.stringify({ name: String(form.get("name") || "Santiago Silva"), email })); router.push("/dashboard");
  }
  return <form className="form" onSubmit={submit}>{mode === "register" && <><div className="field"><label htmlFor="name">Nombre completo</label><input id="name" name="name" required autoComplete="name" placeholder="Santiago Silva"/></div><div className="field"><label htmlFor="rut">RUT</label><input id="rut" name="rut" required placeholder="12.345.678-5"/><small>Solo se usa para identificar tu cuenta.</small></div></>}<div className="field"><label htmlFor="email">Gmail</label><input id="email" name="email" type="email" required autoComplete="email" placeholder="nombre@gmail.com"/></div>{mode !== "forgot" && <div className="field"><label htmlFor="password">Contraseña</label><input id="password" name="password" type="password" minLength={8} required autoComplete={mode === "login" ? "current-password" : "new-password"}/></div>}{error && <p className="form-error" role="status">{error}</p>}<button className="btn btn-primary" type="submit">{mode === "login" ? "Ingresar" : mode === "register" ? "Crear mi cuenta" : "Enviar instrucciones"}</button>{mode === "login" && <p className="auth-foot"><Link href="/forgot-password">Olvidé mi contraseña</Link> · ¿Aún no tienes cuenta? <Link href="/register">Regístrate</Link></p>}{mode === "register" && <p className="auth-foot">¿Ya tienes cuenta? <Link href="/login">Ingresa</Link></p>}</form>;
}
