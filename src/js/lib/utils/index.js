export function debounce(callback, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}

export function builderQueryList(lista, termo, campos) {
    if (!termo || !campos || campos.length === 0) return lista;

    const termoNormalizado = termo.toLowerCase().trim();

    return lista.filter(item => {
        return campos.some(campo => {
            const valor = String(item[campo] || '').toLowerCase();
            return valor.includes(termoNormalizado);
        });
    });
}

