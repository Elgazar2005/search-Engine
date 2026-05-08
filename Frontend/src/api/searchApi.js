import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000/api";

export const searchQuery = async (query, page = 1) => {
    try {
        const response = await axios.get(`${BASE_URL}/search`, {
            params: {
                query: query,
                page: page
            }
        });

        return response.data;

    } catch (error) {
        console.error("Search API Error:", error);
        return {
            results: [],
            expanded_terms: [],
            total_pages: 0
        };
    }
};

export const getSuggestions = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/suggestions`);
        return response.data;

    } catch (error) {
        console.error("Suggestions API Error:", error);
        return [];
    }
};