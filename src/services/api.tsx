import Axios from 'axios';

const Api = Axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const setBearerToken = (accessToken: string) => {
  Api.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
};

export default Api;
