import { z } from "zod";

export const zonasUpdateSchema = z.object({
  zonas: z.array(z.object({
    numeroCanal: z.number()
      .int()
      .min(1, "Número do canal deve ser no mínimo 1")
      .max(8, "Número do canal deve ser no máximo 8"),
    name: z.string()
      .min(3, "Nome deve ter no mínimo 3 caracteres")
      .max(50, "Nome deve ter no máximo 50 caracteres"),
  }))
});

// Inferir tipo para update (campos opcionais)
export type ZonasUpdateData = z.infer<typeof zonasUpdateSchema>;