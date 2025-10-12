import { z } from "zod";

// Regex básico para validar telefone internacional no formato +55...
const telefoneRegex = /^\+\d{1,3}\s?\d{8,13}$/;

export const contatoSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
   email: z.string().min(1, "Email é obrigatório").refine(val => val.includes('@'), {
    message: "Email inválido"
  }),
  telefone: z.string()
    .regex(telefoneRegex, "Telefone inválido. Use formato internacional +55...")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  receberEmail: z.boolean({
    error: "Valor inválido: apenas true ou false são aceitos"
  }).optional().default(true),
  receberWhats: z.boolean({
    error: "Valor inválido: apenas true ou false são aceitos"
  }).optional().default(true),
});

// Inferir tipo
export type ContatoData = z.infer<typeof contatoSchema>;

// Schema de atualização (tudo opcional)
export const contatoUpdateSchema = contatoSchema.partial();

// Inferir tipo para update (campos opcionais)
export type ContatoUpdateData = z.infer<typeof contatoUpdateSchema>;
