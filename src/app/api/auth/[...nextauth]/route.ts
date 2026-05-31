import { handlers } from "@/auth";

// Auth.js v5: expone los endpoints GET/POST de /api/auth/*.
// Corre en Node (auth.ts usa prisma/bcrypt vía el provider).
export const runtime = "nodejs";

export const { GET, POST } = handlers;
