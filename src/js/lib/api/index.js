import { createApiClient } from "./api.js";

const SUPABASE_URL = "https://xvlggnqoaptrzaaaeiem.supabase.co/rest/v1";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2bGdnbnFvYXB0cnphYWFlaWVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0OTQzMTEsImV4cCI6MjA2NzA3MDMxMX0.G6KmXZ07TwWIn_02-CVIuq4y3Fo65A_mRCKAEI5PMqA";

// Configurações Supabase
const supabaseApi = createApiClient({
  baseUrl: SUPABASE_URL,
  defaultHeaders: {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation"
  }
});

// Métodos específicos usando filtros e padrões da API REST do Supabase
export const backend = {
  getAll: (table, { select = "*", filters = {}, range = null } = {}) => {
    const params = { select, ...filters };
    const headers = range ? { Range: `${range[0]}-${range[1]}` } : {};
    return supabaseApi.get(table, { params, headers });
  },

  getById: (table, id, idColumn = "id", select = "*") => {
    const params = { select, [`${idColumn}`]: `eq.${id}` };
    return supabaseApi.get(table, { params });
  },

  insert: (table, data) => {
    return supabaseApi.post(table, data, {
      headers: {
        Prefer: "return=representation"
      }
    });
  },

  update: (table, filters, data) => {
    const params = {};
    for (const key in filters) {
      params[key] = `eq.${filters[key]}`;
    }
    return supabaseApi.patch(table, data, { params });
  },

  remove: (table, filters) => {
    const params = {};
    for (const key in filters) {
      params[key] = `eq.${filters[key]}`;
    }
    return supabaseApi.delete(table, { params });
  }
};
