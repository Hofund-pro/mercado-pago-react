import axios from 'axios';

export const axiosMercadoPago = () => {
  return axios.create({
    baseURL: 'https://api.mercadopago.com'
  });
}