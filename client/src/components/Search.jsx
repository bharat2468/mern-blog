import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery,useQueryClient } from "@tanstack/react-query";
import { searchPosts } from "../api/posts";
import { PostCard, Error, Loading,Input } from "../components";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

const Search = () => {
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const limit = 10;

	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
	} = useForm({
		defaultValues: {
			searchString: "",
			startDate: "",
			endDate: "",
		},
	});

	// Helper function to check if a date is in YYYY-MM-DD format
	const isValidDate = (dateString) => {
		if(dateString === "") return true;
		const regex = /^\d{4}-\d{2}-\d{2}$/;
		return regex.test(dateString);
	};

	const {
		isLoading,
		isError,
		data: response,
		error,
	} = useQuery({
		queryKey: ["searchPosts", page],
		queryFn: () =>
			searchPosts(
				page,
				limit,
				getValues().searchString,
				getValues().startDate,
				getValues().endDate
			),
		keepPreviousData: true,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});

	const onSearchSubmit = () => {
		setPage(1);
		queryClient.refetchQueries(["searchPosts", page]);
		
	};

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
	console.log(response);
	

	const { posts, currentPage, totalPages, totalPosts } = response?.data?.data || {};

	return (
		<div className="drawer lg:drawer-open min-h-screen">
			<input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content flex flex-col ">
				{/* Page content here */}
				<label
					htmlFor="my-drawer-2"
					className="btn btn-primary drawer-button lg:hidden">
					Open drawer
				</label>

                {/* Pagination */}
				<div className="flex justify-center mt-6 relative">
					<button
						onClick={() => setPage((old) => Math.max(old - 1, 1))}
						disabled={page === 1}
						className="btn btn-primary">
						Previous
					</button>
					<span className="px-4 py-2">
						Page {currentPage} of {totalPages} (Total: {totalPosts})
					</span>
					<button
						onClick={() =>
							setPage((old) => (old < totalPages ? old + 1 : old))
						}
						disabled={page === totalPages}
						className="btn btn-primary">
						Next
					</button>
					<Link to="/all-posts" className="btn btn-primary absolute right-0 top-0">Show all Posts</Link>
				</div>

				<h2 className="text-3xl my-6">Post Results</h2>
				<div className="grid grid-cols-2 gap-6">
					{posts?.length ? (
						posts.map((post) => (
							<PostCard
								key={post._id}
								{...post}
								className="basis-1/3"
							/>
						))
					) : (
						<p className="alert alert-error w-full">
							No posts match your search.
						</p>
					)}
				</div>

				
			</div>
			<div className="drawer-side">
				<label
					htmlFor="my-drawer-2"
					aria-label="close sidebar"
					className="drawer-overlay"></label>
				<ul className="menu bg-base-100 text-base-content min-h-full w-80 p-4 mr-5">
					{/* Sidebar content here */}
					<h2 className="text-2xl mb-4">Search Filters</h2>
					<form onSubmit={handleSubmit(onSearchSubmit)}>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">
								Search Query
							</label>
							<Input
								type="text"
								{...register("searchString")}
								placeholder="Enter search query"
							/>
							{errors.searchString && (
								<p className="text-red-500 text-sm mt-1">
									{errors.searchString.message}
								</p>
							)}
						</div>

						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">
								Start Date
							</label>
							<Input
								type="date"
								{...register("startDate", {
									
									validate: (value) =>
										isValidDate(value)
											? true
											: "Invalid date format",
								})}
							/>
							{errors.startDate && (
								<p className="text-red-500 text-sm mt-1">
									{errors.startDate.message}
								</p>
							)}
						</div>

						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">
								End Date
							</label>
							<Input
								type="date"
								{...register("endDate", {
									
									validate: {
										isValidFormat: (value) =>
											isValidDate(value) ||
											"Invalid date format",
										isAfterStartDate: (value) =>
											value >= getValues("startDate") ||
											"End date must be after start date",
									},
								})}
							/>
							{errors.endDate && (
								<p className="text-red-500 text-sm mt-1">
									{errors.endDate.message}
								</p>
							)}
						</div>

						<button
							type="submit"
							className="btn btn-primary w-full">
							<FiSearch className="mr-2" />
							Search
						</button>
					</form>
				</ul>
			</div>
		</div>
	);
};

export default Search;
