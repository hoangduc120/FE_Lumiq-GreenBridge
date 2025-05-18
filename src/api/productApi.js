import instance from "./axios";

const BASE_URL = "http://localhost:5000/product";

export const createProduct = async (productData) => {
    try {
        const response = await instance.post(`${BASE_URL}/create`, productData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const getAllProducts = async (page = 1, limit = 6, sort = '', search = '') => {
    try {
        console.log('API call params:', { page, limit, sort, search });
        const requestUrl = `${BASE_URL}/all`;
        console.log('Request URL:', requestUrl);

        const response = await instance.get(requestUrl, {
            params: { page, limit, sort, search }
        });

        console.log('API Response status:', response.status);
        console.log('API Response data structure:', {
            hasData: !!response.data,
            dataKeys: response.data ? Object.keys(response.data) : [],
            nestedDataKeys: response.data && response.data.data ? Object.keys(response.data.data) : []
        });

        // Trả về toàn bộ response để xử lý ở Redux
        return response;
    } catch (error) {
        console.error('API error details:', error);
        throw error;
    }
};
export const getProductById = async (id) => {
    try {
        const response = await instance.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
}
