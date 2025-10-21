// valid.js
import { z } from "https://cdn.jsdelivr.net/npm/zod@3.22.4/+esm";

if (!z) {
    throw new Error('Zod não foi encontrado. Certifique-se de importar a CDN do Zod antes deste módulo.');
}

// Função para criar schemas usando um callback que recebe o objeto z
function schema(builder) {
    // builder é uma função que recebe z e retorna o schema
    return builder(z);
}

// Função para validar dados com um schema
function validate(schema, data) {
    try {
        const result = schema.safeParse(data);
        return {
            success: result.success,
            data: result.success ? result.data : null,
            errors: result.success ? null : result.error.errors,
        };
    } catch (err) {
        return {
            success: false,
            data: null,
            errors: [err.message],
        };
    }
}

function structure(builder, fnError) {
    const zodSchema = schema(builder);
    return (data) => {
        const result = validate(zodSchema, data);
        if (!result.success) {
            const internalError = result.errors.map(e => e.message).join(", ");
            throw new Error(typeof fnError == 'function' ? fnError(internalError) : internalError);
        }
        return result.data;
    }
}

export default {
    schema,
    validate,
    structure,
    string: z.string,
    number: z.number,
    boolean: z.boolean,
    date: z.date,
    array: z.array,
    object: z.object,
    enum: z.enum,
    literal: z.literal
} ;
