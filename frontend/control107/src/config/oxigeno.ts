export interface ConfiguracionTuboOxigeno {
  maxBar: number;
}

export const CONFIGURACION_OXIGENO: Record<
  string,
  ConfiguracionTuboOxigeno
> = {
  "Tubo grande Presion de oxigeno, medido en Bares": {
    maxBar: 200,
  },

  "Tubo Portátil Presion de oxigeno medido en bares": {
    maxBar: 150,
  },
};