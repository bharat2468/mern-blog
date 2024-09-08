import React, { useState } from "react";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { allUsers, adminDeleteUser } from "../../api/users";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loading, Error } from "../index";
import { format } from "date-fns";
import { useSelector } from "react-redux";

const Users = () => {
	// Sample user data

	const queryClient = useQueryClient();
	const [successMessage, setSuccessMessage] = useState("");
	const loggedInUser = useSelector((state) => state.auth.user);

	const {
		isLoading,
		isError,
		data: response,
		error,
	} = useQuery({
		queryKey: ["all-users"],
		queryFn: allUsers,
		staleTime: 1000 * 60 * 5,
	});

	const { mutate: deleteProfile, isLoading: isDeleting } = useMutation({
		mutationFn: adminDeleteUser,
		onSuccess: () => {
			queryClient.invalidateQueries(["all-users"]);
			setSuccessMessage("User deleted successfully");
			setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
		},
		onError: (deleteError) => {
			console.error(deleteError);
		},
	});

	if (isLoading) {
		return (
			<div className="w-full h-[80vh] flex justify-center items-center">
				<Loading className="w-20" />
			</div>
		);
	}

	if (isError) {
		console.error(error);
		return <Error />;
	}

	

	const users = response?.data?.data;

	// Sample delete handler
	const handleDelete = (userId) => {
		if (
			window.confirm(
				"Are you sure you want to delete this user? This action cannot be undone."
			)
		) {
			deleteProfile(userId);
		}
	};


	return (
		<div className="overflow-x-auto min-h-screen">
			{successMessage && (
				<div className="alert alert-success my-5">
					<div>
						<span>{successMessage}</span>
					</div>
				</div>
			)}
			<table className="table rounded-md">
				<thead>
					<tr className="bg-base-200">
						<th>Date Created</th>
						<th>User Image</th>
						<th>Username</th>
						<th>Email</th>
						<th>Is Admin</th>
						<th>Delete</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user._id} className="hover">
							<td>
								{format(new Date(user.createdAt), "dd-MM-yyyy")}
							</td>
							<td>
								<div className="avatar">
									<div className="w-8 mask mask-squircle">
										<img
											src={
												user.avatar ||
												"https://img.daisyui.com/images/stock/photo-1567653418876-5bb0e566e1c2.webp"
											}
											alt={user.username}
										/>
									</div>
								</div>
							</td>
							<td>{user.username}</td>
							<td>{user.email}</td>
							<td>
								{user.role === "admin" ? (
									<FaCheck className="text-green-500" />
								) : (
									<FaTimes className="text-red-500" />
								)}
							</td>
							<td>
								<button
									className="btn btn-error btn-sm"
									onClick={() => handleDelete(user._id)}
									disabled={isDeleting || user.username === loggedInUser.username}>
									<FaTrash />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Users;
