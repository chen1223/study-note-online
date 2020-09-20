import { API_ENDPOINT } from '../../environments/environment';

/**
 * API endpoints
 */
export const API = {
  LOGIN: `${API_ENDPOINT}/login`,

  /* Users Related APIs */
  USERS_PIC: `${API_ENDPOINT}/users/picture`,

  /* Vocab Related APIs */
  VOCABS: `${API_ENDPOINT}/vocabs`,
  VOCABS_STATUS: `${API_ENDPOINT}/status`,
};
