import axios from 'axios';

const BASE_URL = 'http://localhost:8080/precos';

const PricesAPI = {
  createPrice: async ({tempoInicial, tempoAdicional, valorInicial, valorAdicional}: {tempoInicial: number, tempoAdicional: number, valorInicial: number, valorAdicional: number}) => {
    try {
      const response = await axios.post(BASE_URL, {tempoInicial, tempoAdicional, valorInicial, valorAdicional});
      return response.data;
    } catch (error) {
      console.error('Error creating price:', error);
      throw error;
    }
  },
  
  getPrice: async (id: number) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching price:', error);
      throw error;
    }
  },

  updatePrice: async ({id, tempoInicial, tempoAdicional, valorInicial, valorAdicional}: {id: number, tempoInicial: number, tempoAdicional: number, valorInicial: number, valorAdicional: number}) => {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, {id, tempoInicial, tempoAdicional, valorInicial, valorAdicional});
      return response.data;
    } catch (error) {
      console.error('Error updating price:', error);
      throw error;
    }
  },

  deletePrice: async (id: number) => {
    try {
      const response = await axios.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting price:', error);
      throw error;
    }
  },

  getAllPrices: async () => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all prices:', error);
      throw error;
    }
  }
};

export default PricesAPI;

