import zUtils from "../lib/zod/index.js";

const equipmentSchema = zUtils.schema(z => z.object({
  id: z.number().int(), // id
  name: z.string().min(1, "O nome do equipamento é obrigatório"), // nome
  description: z.string().min(1, "A descrição é obrigatória"), // descricao
  responsibleName: z.string(), // nm_responsavel
  responsibleContact: z.string(), // contato_responsavel
  patrimonyNumber: z.string(), // nr_patrimonio
  category: z.string(), // categoria
  imageUrl: z.string().url("URL da imagem inválida").optional(), // imagem_url
  spaceId: z.number().int() // espaco_id
}));

function Equipment(data) {
  const result = zUtils.validate(equipmentSchema, data);
  if (!result.success) {
    throw new Error("Erro ao criar equipamento: " + result.errors.map(e => e.message).join(", "));
  }
  return result.data;
}

export { Equipment };
