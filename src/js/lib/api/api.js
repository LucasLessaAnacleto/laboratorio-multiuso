import z from "../zod/index.js";

function createApiClient(config) {
    const configSchema = z.structure(z => z.object({
        baseUrl: z.string().url("A URL base é inválida."),
        defaultHeaders: z.record(z.string()).optional()
    }), (msg) => `Erro na configuração do client: ${msg}`);

    const endpointSchema = z.structure(z => z.string()
        .refine(str => !str.startsWith("/"), "O endpoint não deve começar com '/'"),
    (msg) => `Erro no endpoint: ${msg}`);
    const { baseUrl, defaultHeaders = {} } = configSchema(config);

    function buildQuery(params = {}) {
        return new URLSearchParams(params).toString();
    }

    async function handleRequest(method = "GET", endpoint = "", { params = {}, headers = {}, body = null, rawResponse = false } = {}) {
        endpoint = endpointSchema(endpoint);
        const queryString = buildQuery(params);
        const url = `${baseUrl}/${endpoint}${queryString ? `?${queryString}` : ""}`;

        try {
        const response = await fetch(url, {
            method,
            headers: {
            ...defaultHeaders,
            ...headers,
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ${response.status}: ${errorText}`);
        }

        if (rawResponse) return response;

        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
            return await response.json();
        }

        return null;
        } catch (err) {
        console.error("Erro na requisição:", err);
        throw err;
        }
    }

    return {
        get(endpoint, options = {}) {
            return handleRequest("GET", endpoint, options);
        },
        post(endpoint, body, options = {}) {
            return handleRequest("POST", endpoint, { ...options, body });
        },
        patch(endpoint, body, options = {}) {
            return handleRequest("PATCH", endpoint, { ...options, body });
        },
        delete(endpoint, options = {}) {
            return handleRequest("DELETE", endpoint, options);
        }
    };
}

export { createApiClient };

// V2

// import z from "../zod/index.js";

// function createApiClient(config) {
//     const configSchema = z.structure(z => z.object({
//         baseUrl: z.string().url("A URL base é inválida."),
//         defaultHeaders: z.record(z.string()).optional()
//     }), (msg) => `Erro na configuração do client: ${msg}`);

//     const endpointSchema = z.structure(z => z.string()
//         .refine(str => !str.startsWith("/"), "O endpoint não deve começar com '/'"),
//         (msg) => `Erro no endpoint: ${msg}`);
//     const { baseUrl, defaultHeaders = {} } = configSchema(config);

//     function buildQuery(params = {}) {
//         return new URLSearchParams(params).toString();
//     }

//     async function request(endpoint = '', options = {}) {
//         endpoint = endpointSchema(endpoint);
//         const { method = "GET", headers = {}, body, rawResponse = false } = options;

//         try {
//         const response = await fetch(`${baseUrl}/${endpoint}`, {
//             method,
//             headers: {
//             ...defaultHeaders,
//             ...headers,
//             },
//             body: body ? JSON.stringify(body) : undefined,
//         });

//         if (!response.ok) {
//             const errorText = await response.text();
//             throw new Error(`Erro ${response.status}: ${errorText}`);
//         }

//         if (rawResponse) return response;

//         const contentType = response.headers.get("content-type");
//         if (contentType?.includes("application/json")) {
//             return await response.json();
//         }

//         return null;
//         } catch (err) {
//         console.error("Erro na requisição:", err);
//         throw err;
//         }
//     }

//     return { request, buildQuery };
// }

// export { createApiClient };


// V1

// function createApiClient({ baseUrl, defaultHeaders = {} }) {
//   function buildQuery(params = {}) {
//     return new URLSearchParams(params).toString();
//   }

//   async function request(endpoint, options = {}) {
//     try {
//       const response = await fetch(`${baseUrl}/${endpoint}`, {
//         headers: {
//           ...defaultHeaders,
//           ...(options.headers || {}),
//         },
//         method: options.method || "GET",
//         body: options.body ? JSON.stringify(options.body) : undefined,
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Erro ${response.status}: ${errorText}`);
//       }

//       if (options.rawResponse) return response;

//       const contentType = response.headers.get("content-type");
//       if (contentType && contentType.includes("application/json")) {
//         return await response.json();
//       }

//       return null;
//     } catch (error) {
//       console.error("Erro na requisição:", error);
//       throw error;
//     }
//   }

//   return {
//     async get(table, { select = "*", filters = {}, range = null } = {}) {
//       const query = buildQuery({ select, ...filters });
//       const headers = { ...defaultHeaders };
//       if (range) headers["Range"] = `${range[0]}-${range[1]}`;

//       return request(`${table}?${query}`, {
//         headers,
//         method: "GET",
//       });
//     },

//     async post(table, data, prefer = "return=minimal") {
//       return request(`${table}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Prefer: prefer,
//         },
//         body: data,
//       });
//     },

//     async patch(table, filters, data, prefer = "return=minimal") {
//       const query = buildQuery(filters);
//       return request(`${table}?${query}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Prefer: prefer,
//         },
//         body: data,
//       });
//     },

//     async remove(table, filters) {
//       const query = buildQuery(filters);
//       return request(`${table}?${query}`, {
//         method: "DELETE",
//       });
//     },
//   };
// }

// export { createApiClient };
