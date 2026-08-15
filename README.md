# Savia M1 — Plataforma de ensayos PAES

Aplicación Next.js para generar, realizar, corregir y analizar ensayos de Competencia Matemática 1. La experiencia completa funciona en modo demostración sin secretos; la carpeta `supabase/` contiene el esquema de producción con RLS, índices y control de exposición.

## Capacidades

- Blueprint de 65 posiciones con ejes, habilidades, dificultad y recursos.
- Banco original y validación determinística de cuatro alternativas.
- Cronómetro de 2 h 20 min basado en timestamp, navegación y autosave.
- Respuestas correctas omitidas del payload del ensayo activo; corrección server-side.
- Resultados, análisis por eje, revisión completa y PDF descargable.
- Validación de Gmail y RUT chileno.
- Migración PostgreSQL con RLS, banco central, antirrepetición, roles e índices.
- Adaptadores preparados para Supabase, OpenAI y Resend.

## Arquitectura

```text
Browser (preguntas sanitizadas)
  → Route Handlers (rate limit + Zod)
    → Blueprint / selección / validación
      → Supabase PostgreSQL (RLS + exposiciones)
    → corrección server-side
      → feedback OpenAI + PDF + Resend
```

En modo demo, las preguntas públicas y respuestas del estudiante se recuperan en `localStorage`; las claves correctas solo existen en el Route Handler de entrega. El modo de producción reemplaza esa persistencia por las tablas y políticas incluidas.

## Stack

Next.js App Router, React, TypeScript, Supabase/PostgreSQL, Zod, OpenAI, Resend, pdf-lib, Vitest y Playwright.

## Configuración

1. Copia `.env.example` como `.env.local`.
2. Para producción, crea un proyecto Supabase y ejecuta en orden:

```bash
supabase db push
supabase db seed
```

3. Configura las variables sin exponer valores `SUPABASE_SERVICE_ROLE_KEY`, `RUT_ENCRYPTION_KEY`, `RUT_HASH_PEPPER`, `OPENAI_API_KEY` o `RESEND_API_KEY` en el cliente.

Variables:

| Variable | Uso |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL pública del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anon protegida por RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Operaciones server-side; nunca al navegador |
| `RUT_ENCRYPTION_KEY` | Cifrado del RUT normalizado |
| `RUT_HASH_PEPPER` | Hash para unicidad sin registrar el RUT |
| `OPENAI_API_KEY` | Generación estructurada y feedback |
| `RESEND_API_KEY` | Correo transaccional |
| `RESEND_FROM_EMAIL` | Remitente verificado |
| `DEMO_MODE` | `true` para recorrer el producto sin servicios externos |

## Desarrollo y verificación

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

## Seguridad y privacidad

Las políticas impiden consultar el banco completo y no existe una policy de lectura estudiantil para `questions`. El RUT no se usa como PK, URL ni dato de informe/correo. Las migraciones exigen `email UNIQUE`, `rut_hash UNIQUE`, un solo ensayo activo, entrega idempotente y exposición única por estudiante/pregunta.

## Despliegue

El proyecto es compatible con Vercel. Configura las variables en Development, Preview y Production, conecta Supabase, ejecuta las migraciones y despliega. Sin claves, el deployment permanece utilizable en modo demo y marca email/IA/Supabase como pendientes de configuración.

## Fuentes curriculares

La estructura se preparó a partir del Temario PAES M1 Admisión 2027 y del análisis de patrones de la selección de preguntas PAES M1 Admisión 2026. Las preguntas incluidas son originales y no copian ni parafrasean ítems DEMRE.

