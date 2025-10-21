import zUtils from "../lib/zod/index.js";

const spaceSchema = zUtils.schema(z => z.object({
  id: z.number().int().optional(), // id
  nome: z.string().min(1, "O nome é obrigatório"), // nome
  descricao: z.string().min(1, "A descrição é obrigatória"), // descricao
  endereco: z.string(), // endereco
  contato: z.string(), // contato
  disponibilidade: z.string(), // disponibilidade
  departamento: z.string(), // departamento
  politica_uso: z.string(), // politica_uso
  nr_sala: z.string(), // nr_sala
  nr_andar: z.string(), // nr_andar
  imagem_url: z.string().url("URL da imagem inválida").optional() // imagem_url
}));


function Space(data) {
  const result = zUtils.validate(spaceSchema, data);
  if (!result.success) {
    throw new Error("Erro ao criar espaço: " + result.errors.map(e => e.message).join(", "));
  }
  return result.data;
}

export { Space };
