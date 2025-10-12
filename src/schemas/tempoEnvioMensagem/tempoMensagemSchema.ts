import { z } from 'zod';

export const tempoMensagemSchema = z.object({
  tempo: z.number()
    .int("Tempo deve ser um número inteiro")
    .min(60000, "Tempo mínimo de 60000ms (1 minuto)")
    .max(600000, "Tempo máximo de 600000ms (10 minutos)"),
});

// Inferir tipo
export type TempoEnvioMensagem = z.infer<typeof tempoMensagemSchema>;

// Schema de atualização (todos os campos são opcionais)
export const tempoMensagemUpdateSchema = tempoMensagemSchema.partial();

// Inferir tipo para update (campos opcionais)
export type TempoMensagemUpdateData = z.infer<typeof tempoMensagemUpdateSchema>;