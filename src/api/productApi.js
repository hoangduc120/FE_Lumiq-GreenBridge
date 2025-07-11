import instance from "./axios";

const BASE_URL = "https://be-lumiq-greenbrige-a0kh.onrender.com/product";

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
        const requestUrl = `${BASE_URL}`;

        const response = await instance.get(requestUrl, {
            params: { page, limit, sort, search }
        });
        // Trả về toàn bộ response để xử lý ở Redux
        console.log("1",response.data);
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
        if (error.response?.status === 404) {
            throw new Error('Không tìm thấy sản phẩm');
        }
        throw error;
    }
}

export const getAddressData = async (province, district, ward_street) => {
    try {
        const res = await instance.post(`${BASE_URL}/api/product/address`, {
            province,
            district,
            ward_street,
        });
        return res.data.data;
    } catch (err) {
        return err;
    }
};
