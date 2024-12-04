import axios from 'axios';

const BASE_URL = 'http://localhost:8080/permanencias';

const PermanenciasAPI = {
  createPermanencia: async ({dataHoraEntrada, dataHoraSaida, placaVeiculo, vagaId, funcionarioId, precoId}: {dataHoraEntrada: string, dataHoraSaida: string, placaVeiculo: string, vagaId: number, funcionarioId: number, precoId: number}) => {
    try {
      const response = await axios.post(BASE_URL, {dataHoraEntrada, dataHoraSaida, placaVeiculo, vagaId, funcionarioId, precoId});
      return response.data;
    } catch (error) {
      console.error('Error creating permanencia:', error);
      throw error;
    }
  },
  
  getPermanencia: async (id: number) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching permanencia:', error);
      throw error;
    }
  },

  updatePermanencia: async ({id, dataHoraEntrada, dataHoraSaida, placaVeiculo, vagaId, funcionarioId, precoId}: {id: number, dataHoraEntrada: string, dataHoraSaida: string, placaVeiculo: string, vagaId: number, funcionarioId: number, precoId: number}) => {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, {id, dataHoraEntrada, dataHoraSaida, placaVeiculo, vagaId, funcionarioId, precoId});
      return response.data;
    } catch (error) {
      console.error('Error updating permanencia:', error);
      throw error;
    }
  },

  deletePermanencia: async (id: number) => {
    try {
      const response = await axios.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting permanencia:', error);
      throw error;
    }
  },

  getAllPermanencias: async () => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all permanencias:', error);
      throw error;
    }
  }
};

export default PermanenciasAPI;
