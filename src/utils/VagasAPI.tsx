import axios from 'axios';

const BASE_URL = 'http://localhost:8080/vagas';

const VagasAPI = {
  createVaga: async ({id, numero, localizacaoHorizontal, localizacaoVertical}: {id: number, numero: number, localizacaoHorizontal: number, localizacaoVertical: number}) => {
    try {
      const response = await axios.post(BASE_URL, {id, numero, localizacaoHorizontal, localizacaoVertical});
      return response.data;
    } catch (error) {
      console.error('Error creating vaga:', error);
      throw error;
    }
  },
  
  getVaga: async (id: number) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vaga:', error);
      throw error;
    }
  },

  updateVaga: async ({id, numero, localizacaoHorizontal, localizacaoVertical}: {id: number, numero: number, localizacaoHorizontal: number, localizacaoVertical: number}) => {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, {id, numero, localizacaoHorizontal, localizacaoVertical});
      return response.data;
    } catch (error) {
      console.error('Error updating vaga:', error);
      throw error;
    }
  },

  deleteVaga: async (id: number) => {
    try {
      const response = await axios.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting vaga:', error);
      throw error;
    }
  },

  getAllVagas: async () => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all vagas:', error);
      throw error;
    }
  }
};

export default VagasAPI;

