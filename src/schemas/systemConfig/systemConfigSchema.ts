import { z } from 'zod';

export const systemConfigSchema = z.object({
  empresaName: z.string().min(1, "O nome da empresa é obrigatório"),
  logoUrl: z.string().url("A URL do logo deve ser válida").optional(),
  email: z.string().email("O email deve ser válido").optional(),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
});

// Inferir tipo
export type SystemConfigData = z.infer<typeof systemConfigSchema>;

// Schema de atualização (todos os campos são opcionais)
export const systemConfigUpdateSchema = systemConfigSchema.partial();

// Inferir tipo para update (campos opcionais)
export type SystemConfigUpdateData = z.infer<typeof systemConfigUpdateSchema>;