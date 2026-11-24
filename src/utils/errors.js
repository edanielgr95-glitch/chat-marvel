export function getUserMessage(error) {
  if (error?.code === 'NETWORK') {
    return 'Sin conexión. Revisa tu internet e inténtalo de nuevo.';
  }
  if (error?.status === 404) {
    return 'No encontramos la información solicitada.';
  }
  if (error?.status === 429) {
    return 'Demasiadas solicitudes. Espera unos segundos.';
  }
  if (error?.status >= 500) {
    return 'El servidor tuvo un problema. Inténtalo más tarde.';
  }
  return 'Ocurrió un error inesperado.';
}