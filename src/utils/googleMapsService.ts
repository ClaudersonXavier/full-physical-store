import { cepInfos } from './viaCepService';

export class GoogleApiService {
  static async getCordenates(cep: string) {
    try {
      const apiKey = process.env.GOOGLE_API_KEY;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=${apiKey}`,
      );

      if (!response.ok) {
        throw new Error('Erro ao comunicar com a API do google.');
      }

      const data = await response.json();

      if (!data.results || data.status === 'ZERO_RESULTS') {
        const cepData = await cepInfos(cep);
        const formattedAddress = `${cepData.logradouro}, ${cepData.cidade}, ${cepData.uf}`;
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=${apiKey}`,
        );

        const newData = await response.json();
        if (!newData.results || newData.status === 'ZERO_RESULTS') {
          throw new Error('Coordenadas não encontradas!');
        }

        const location = newData.results[0].geometry.location;

        return {
          latitude: location.lat,
          longitude: location.lng,
        };
      }

      const location = data.results[0].geometry.location;

      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  static async distanceCalculator(
    lat1: string,
    lng1: string,
    lat2: string,
    lng2: string,
  ) {
    try {
      const apiKey = process.env.GOOGLE_API_KEY;

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat1},${lng1}&destinations=${lat2},${lng2}&key=${apiKey}`,
      );

      const data = await response.json();

      if (!data.results || data.status === 'ZERO_RESULTS') {
        throw new Error('Erro ao calcular distância na api do Google');
      }

      return data.rows[0].elements[0].distance['value'] / 1000;
    } catch (error) {
      throw new Error(error);
    }
  }
}
