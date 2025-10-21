const queryParams = {
    get(chave) {
      const url = new URL(window.location.href);
      return url.searchParams.get(chave);
    },
  
    set(chave, valor, replace = false) {
      const url = new URL(window.location.href);
      url.searchParams.set(chave, valor);
      window.history[replace ? 'replaceState' : 'pushState']({}, '', url);
    },
  
    remove(chave, replace = false) {
      const url = new URL(window.location.href);
      url.searchParams.delete(chave);
      window.history[replace ? 'replaceState' : 'pushState']({}, '', url);
    },
  
    all() {
      const url = new URL(window.location.href);
      const params = {};
      for (const [key, value] of url.searchParams.entries()) {
        params[key] = value;
      }
      return params;
    },
  
    clear(replace = false) {
      const url = new URL(window.location.href);
      url.search = '';
      window.history[replace ? 'replaceState' : 'pushState']({}, '', url);
    }
};

export { queryParams };
