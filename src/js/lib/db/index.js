import { backend } from "../api/index.js";



const createResource = (table, options = {}) => {
    function toSupabaseFilters(filters = {}) {
        const formatted = {};
        for (const key in filters) {
        if (filters[key] != null) {
            formatted[key] = `eq.${filters[key]}`;
        }
        }
        return formatted;
    }

    return {
        async select(filters = {}, { select = "*" } = {}) {
            const hasFilters = Object.keys(filters).length > 0;
            const params = {
                select,
                ...(hasFilters ? { filters: toSupabaseFilters(filters) } : {})
            };

            return backend.getAll(table, params);
            },

            async selectRange({ start, end }, filters = {}, { select = "*" } = {}) {
            const hasFilters = Object.keys(filters).length > 0;
            const params = {
                select,
                ...(hasFilters ? { filters: toSupabaseFilters(filters) } : {})
            };

            const headers = {
                Range: `${start}-${end}`
            };

            return backend.getAll(table, { ...params, headers });
            },

            async selectId(id) {
                return backend.getById(table, id).then(resp => (resp || [])?.length > 0 ? resp[0] : null);
            },

            async delete(filters) {
            return backend.remove(table, filters);
            },

            async patch(filters, data) {
                return backend.update(table, filters, data);
            },

            async insert(data) {
                return backend.insert(table, data, {
                    prefer: "resolution=merge-duplicates"
                });
            }
    };
};

export const db = {
    space: createResource("espaco"),
    equipment: createResource("equipamento"),
    reservation: createResource("reserva")
};
