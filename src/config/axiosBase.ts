import axios from 'axios';

export const axiosMercadoPago = () => {
  return axios.create({
    baseURL: 'https://api.mercadopago.com'
  });
}

export const axiosAPI = () => {
  return axios.create({
    baseURL: 'http://localhost:3000/api'
  });
}