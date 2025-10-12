
import { z } from "zod";

const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;

export const equipSchema = z.object({

  name: z.string().min(1, "Nome é obrigatório!"),
  modelo: z.number().min(1, "Modelo é obrigatório!"),
  description: z.string().min(1, "Descrição é obrigatória!"),
  ip: z.string()
    .refine(val => {
      if (!ipv4Regex.test(val)) return false;
      const parts = val.split(".").map(Number);
      return parts.every(part => part >= 0 && part <= 254); // aqui não aceita 255
    }, { message: "IP inválido ou contém octeto 255" }),
  port: z.number()
    .int("Porta deve ser um número inteiro")
    .min(1, "Porta inválida! nínimo 1")
    .refine(val => val <= 65535, { message: "Porta inválida! máximo de 65535" }),
  ativo: z.boolean({
    error: "Valor inválido: apenas true ou false são aceitos"
  }).default(true)
});

// Inferir tipo TypeScript opcionalmente:
export type EquipData = z.infer<typeof equipSchema>;

// Schema de atualização (tudo opcional)
export const equipUpdateSchema = equipSchema.partial();

// Inferir tipo para update (campos opcionais)
export type EquipUpdateData = z.infer<typeof equipUpdateSchema>;
