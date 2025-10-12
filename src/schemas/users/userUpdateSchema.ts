import { z } from "zod";
import { NivelUsuario } from "@prisma/client";

const validNiveis = Object.values(NivelUsuario); // Array de valores válidos

export const userUpdateSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().min(1, "Email é obrigatório").refine(val => val.includes('@'), {
    message: "Email inválido"
  }),
  nivel: z.enum(validNiveis as [string, ...string[]], {
    message: "Nível de usuário inválido"
  }),

  oldPassword: z.string().min(8, "Senha atual é obrigatória"),
  newPassword: z.string().min(8, "Nova senha deve ter no mínimo 8 caracteres"),
  confirmPassword: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),

}).refine( data => {
  if (data.newPassword || data.confirmPassword) {
    return data.newPassword === data.confirmPassword;
  }
  return true;
}, {
  message: "Nova senha e confirmação desem ser iguais",
  path: ["confirmPassword"],
});

// Inferir tipo TypeScript
export type UserUpdateData = z.infer<typeof userUpdateSchema>;
