import axios from 'axios';

const BASE_URL = 'http://localhost:8080/vagas';

const VagasAPI = {
  createVaga: async ({numero, locHorizontal, locVertical}: {numero: number, locHorizontal: number, locVertical: number}) => {
    try {
      console.log({numero, locHorizontal, locVertical});
      const response = await axios.post(BASE_URL, {numero, locHorizontal, locVertical});
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
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching vaga:', error);
      throw error;
    }
  },

  updateVaga: async ({id, numero, locHorizontal, locVertical}: {id: number, numero: number, locHorizontal: number, locVertical: number}) => {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, {id, numero, locHorizontal, locVertical});
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
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return [];
      }
      console.error('Error fetching all vagas:', error);
      throw error;
    }
  }
};

export default VagasAPI;

