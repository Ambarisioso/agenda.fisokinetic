# Guía de Despliegue en Vercel (Fase 2)

Esta guía te llevará paso a paso para publicar tu agenda en **Vercel** de manera gratuita y segura.

## Paso 1: Preparar tu Código (GitHub)
1.  Crea un **nuevo repositorio** en tu cuenta de GitHub (puede ser privado).
2.  Sube todo el código de este proyecto al repositorio. (Si no sabes usar Git, puedes arrastrar los archivos en la web de GitHub, excepto `node_modules`, `.next` y `dev.db`).

## Paso 2: Crear Proyecto en Vercel
1.  Ve a [vercel.com](https://vercel.com) e inicia sesión con GitHub.
2.  Haz clic en **"Add New..."** -> **"Project"**.
3.  Selecciona tu repositorio `fisiokinetic-agenda` (o como lo hayas llamado).
4.  En la configuración del proyecto ("Configure Project"):
    *   **Framework Preset**: Next.js (se detecta solo).
    *   **Root Directory**: `./` (déjalo así).
    *   **Environment Variables**: Despliega esta sección y agrega:
        *   `ADMIN_USER` = `admin`
        *   `ADMIN_PASSWORD` = `fisiokinetic2024`
        *   `AUTH_SECRET` = `(Copia el valor que generamos en .env)`

5.  **NO hagas clic en Deploy todavía**.

## Paso 3: Configurar Base de Datos (PostgreSQL)
Vercel no guarda archivos, por lo que `dev.db` (SQLite) se borraría cada vez. Usaremos **Vercel Postgres** (gratis).

1.  En el dashboard de Vercel de tu nuevo proyecto, ve a la pestaña **"Storage"**.
2.  Haz clic en **"Create Database"** -> **"Postgres"**.
3.  Acepta las condiciones y selecciona la región más cercana (ej. `iad1` - Washington, D.C.).
4.  Una vez creada, Vercel agregará automáticamente las variables de entorno (`POSTGRES_PRISMA_URL`, etc.) a tu proyecto.

## Paso 4: Ajustar Código para Producción
Vercel necesita saber que usaremos Postgres en lugar de SQLite.

1.  Abre el archivo `prisma/schema.prisma` en tu código.
2.  Cambia el `provider`:
    ```prisma
    datasource db {
      provider = "postgresql" // Antes era "sqlite"
      url      = env("POSTGRES_PRISMA_URL") // Variable automática de Vercel
      directUrl = env("POSTGRES_URL_NON_POOLING") // Para migraciones directas
    }
    ```
3.  Haz *commit* y *push* de este cambio a GitHub.

## Paso 5: Despliegue Final
1.  Al subir el cambio del paso 4 a GitHub, Vercel detectará el nuevo commit.
2.  Iniciará un "Build".
3.  Espera unos minutos... ¡y tu aplicación estará en vivo! 🎉

## Paso 6: Configurar Dominio
1.  En Vercel, ve a **Settings** -> **Domains**.
2.  Agrega `agenda.fisiokinetic.mx` (o el subdominio que prefieras).
3.  Vercel te dará unos registros DNS (tipo A o CNAME) que deberás poner en tu panel de **IONOS** para conectar tu dominio.
