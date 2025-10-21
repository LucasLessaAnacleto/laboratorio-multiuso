import zUtils from "../lib/zod/index.js";

const reservationSchema = zUtils.schema(z => z.object({
  id: z.number().int(), // id
  reservationDate: z.string().min(1, "A data da reserva é obrigatória"), // dt_reserva
  timeRange: z.string().min(1, "O horário é obrigatório"), // hr_ini_fim
  userName: z.string().min(1, "O nome do usuário é obrigatório"), // nm_usuario
  userContact: z.string().min(1, "O contato do usuário é obrigatório"), // contato_usuario
  requestDate: z.string().min(1, "A data da solicitação é obrigatória"), // dt_solicitacao
  spaceId: z.number().int(), // espaco_id
  notes: z.string() // ds_reserva
}));

function Reservation(data) {
  const result = zUtils.validate(reservationSchema, data);
  if (!result.success) {
    throw new Error("Erro ao criar reserva: " + result.errors.map(e => e.message).join(", "));
  }
  return result.data;
}

export { Reservation };
