import api from "./axiosConfig";

const createPost = async (data) => {
	return await api.post("/posts/create", data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};

const updatePostData = async (data,postId) => {
	return await api.patch(`/posts/update-data/${postId}`, data);
};

const updatePostImage = async (data,postId) => {
	console.log(data);
	return await api.patch(`/posts/update-image/${postId}`, data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

};

const allPosts = async (page = 1, limit = 9,pagination) => {
    return await api.get(`/posts/all-posts?page=${page}&limit=${limit}&pagination=${pagination}`);
};

const getPost = async (slug) => {
	return await api.get(`/posts/get-post/${slug}`);
};

export { createPost, updatePostData, updatePostImage, allPosts, getPost };
