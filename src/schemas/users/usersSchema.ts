import { z } from "zod";
import { NivelUsuario } from "@prisma/client";

const validNiveis = Object.values(NivelUsuario); // Array de valores válidos

export const userSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().min(1, "Email é obrigatório").refine(val => val.includes('@'), {
    message: "Email inválido"
  }),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  nivel: z.enum(validNiveis as [string, ...string[]], {
    message: "Nível de usuário inválido"
  })
});

// Inferir tipo TypeScript
export type UserData = z.infer<typeof userSchema>;


