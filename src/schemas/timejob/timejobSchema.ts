import { z } from "zod";

export const timejobSchema = z.object({
  intervalo_ms: z.number()
    .int("Intervalo deve ser um número inteiro")
    .min(1000, "Intervalo mínimo de 1000ms (1 segundo)")
    .max(60000, "Intervalo máximo de 60000ms (1 minuto)"),
});

// Inferir tipo 
export type Timejob = z.infer<typeof timejobSchema>;

// Schema de atualização (tudo opcional)
export const timejobUpdateSchema = timejobSchema.partial();

// Inferir tipo para update (campos opcionais)
export type TimejobUpdateData = z.infer<typeof timejobUpdateSchema>;
