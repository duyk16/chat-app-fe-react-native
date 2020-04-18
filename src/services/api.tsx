import Axios from 'axios';

import { API_HOST_NAME } from '../config/server';

const Api = Axios.create({
  baseURL: API_HOST_NAME,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const setBearerToken = (accessToken: string) => {
  Api.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
};

export default Api;
