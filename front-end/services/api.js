import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URI,
    withCredentials: true, // Isso permite que o Axios envie cookies de autenticação
});

api.interceptors.request.use(config => {
    const token = window.localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(response => {
    // Verifica se a resposta é OK (status 2xx) antes de retornar os dados
    if (response.status >= 200 && response.status < 300) {
        return response.data;
    } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
}, error => {
    // Trata erros de resposta, como 401 Unauthorized
    if (error.response && error.response.status === 401) {
        throw new Error('usuário ou senha incorretos');
    } else if (error.response && error.response.status === 409) {
        throw new Error('O e-mail informado já esta cadastrado');
    } else if (error.response && error.response.status === 500) {
        throw new Error('Erro interno, possivel motivo: O arquivo enviado é muito grande. O tamanho máximo permitido é 2MB.' );
    } else {
        throw new Error(`${error.message}`);
    }
});

export const post = async (path, data) => {
    try {
        const response = await api.post(path, data);
        return response;
    } catch (error) {
        throw new Error(`ERRO: ${error.message}`);
    }
};

export const put = async (path, data) => {
    try {
        const response = await api.put(path, data);
        return response;
    } catch (error) {
        throw new Error(`ERRO: ${error.message}`);
    }
};

export const get = async (path) => {
    try {
        const response = await api.get(path);
        return response;
    } catch (error) {
        throw new Error(`ERRO: ${error.message}`);
    }
};

export const del = async (path) => {
    try {
        const response = await api.delete(path);
        return response;
    } catch (error) {
        throw new Error(`ERRO: ${error.message}`);
    }
};

export default api;
