import axios from 'axios';

const BASE_URL = 'http://localhost:8080/funcionarios';

const FuncionariosAPI = {
  createFuncionario: async (funcionarioData: any) => {
    try {
      const response = await axios.post(BASE_URL, funcionarioData);
      return response.data;
    } catch (error) {
      console.error('Error creating funcionario:', error);
      throw error;
    }
  },
  
  getFuncionario: async (id: number) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching funcionario:', error);
      throw error;
    }
  },

  getAllFuncionarios: async () => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return [];
      }
      console.error('Error fetching all funcionarios:', error);
      throw error;
    }
  },

  updateFuncionario: async (id: number, funcionarioData: any) => {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, funcionarioData);
      return response.data;
    } catch (error) {
      console.error('Error updating funcionario:', error);
      throw error;
    }
  },

  deleteFuncionario: async (id: number) => {
    try {
      const response = await axios.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting funcionario:', error);
      throw error;
    }
  },

  login: async (email: string, senha: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, { email, senha });
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }
};

export default FuncionariosAPI;