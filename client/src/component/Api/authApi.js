import axios from 'axios';

const authApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL, 
});

// Add a request interceptor to include the token from session storage
authApi.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token'); // Retrieve token from session storage
        if (token) {
            config.headers.Authorization = `${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default authApi;