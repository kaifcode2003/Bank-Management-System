import axios from 'axios';
import { getStoredAuth } from '../hooks/useAuth.js';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

api.interceptors.request.use((config) => {
	const auth = getStoredAuth();
	if (auth?.token) {
		config.headers.Authorization = `Bearer ${auth.token}`;
	}
	return config;
});

export default api;