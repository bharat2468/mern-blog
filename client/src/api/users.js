import api from "./axiosConfig";

const getCurrentUser = async () => {
	return await api.get("/users/get-user");
};

const allUsers = async () => {
	return await api.get("/users/all-users");
};

const googleAuth = async (token) => {
	return await api.post("/users/google", {token});
};

const login = async (data) => {
	return await api.post("/users/login", data);
};

const logout = async (data) => {
	return await api.post("/users/logout");
};

const signUp = async (data) => {
	return await api.post("/users/register", data);
};

const updateUserData = async (data) => {
	return await api.patch("/users/update-user-details", data);
};

const updateAvatar = async (data) => {
	return await api.post("/users/update-avatar", data);
};

const changePassword = async (data) => {
	return await api.post("/users/change-password", data);
};

const adminDeleteUser = async (id) => {
    return await api.delete(`/users/admin-delete/${id}`);
};


export {
	getCurrentUser,
	allUsers,
	login,
	logout,
	signUp,
	updateAvatar,
	updateUserData,
	changePassword,
	googleAuth,
	adminDeleteUser,
};
