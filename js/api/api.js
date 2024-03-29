import { PROXY_URL, BASE_URL, PROXY_CORS_API_KEY } from './const.js';

export const getReservations = async () => {
  return await fetch(`${PROXY_URL}${BASE_URL}v1/store/9533/reservations`, {
    method: 'GET',
    headers: {
      'x-cors-api-key': PROXY_CORS_API_KEY,
      'Content-Type': 'application/json',
    },
  });
};
