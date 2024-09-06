import api from "./axiosConfig";

const createPost = async (data) => {
	return await api.post("/posts/create", data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};

const updatePostData = async (data, postId) => {
	return await api.patch(`/posts/update-data/${postId}`, data);
};

const updatePostImage = async (data, postId) => {
	console.log(data);
	return await api.patch(`/posts/update-image/${postId}`, data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};

const deletePost = async (postId) => {
	return await api.delete(`/posts/delete/${postId}`);
};

const allPosts = async (page = 1, limit = 9, pagination,searchString) => {
	return await api.get(
		`/posts/all-posts?page=${page}&limit=${limit}&pagination=${pagination}&searchString=${searchString}`
	);
};

const getPost = async (slug) => {
	return await api.get(`/posts/get-post/${slug}`);
};

const searchPosts = async (query) => {
	const { searchString } = query;
	return await api.get(
		`/posts/search?searchString=${searchString}`
	);

};

export {
	createPost,
	updatePostData,
	updatePostImage,
	allPosts,
	getPost,
	deletePost,
	searchPosts,
};
