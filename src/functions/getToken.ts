import {axiosMercadoPago} from "../config/axiosBase";

type Argumentos = {
  token: string
}
export const getToken = ({token}: Argumentos) => {
  return axiosMercadoPago().post('/oauth/token', {
      "client_secret": "client_secret",
      "client_id": "client_id",
      "grant_type": "authorization_code",
      "code": "TG-XXXXXXXX-241983636"
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
}