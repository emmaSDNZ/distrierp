  //Modulo Deboude 
export const debouceTime = (inputValue) => {
    const trimmed = inputValue.trim();
    if (trimmed.length < 3) return;
    const debounceTimer = setTimeout(() => {
      handleSearch();
    }, 500); // Espera 500ms desde la última tecla
    return () => clearTimeout(debounceTimer); // Limpia el temporizador si vuelve a escribir
  }


