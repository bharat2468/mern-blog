import React, { useState } from "react";
import { allPosts } from "../api/posts";
import { Container, Error, Loading, PostCard } from "../components";
import { useQuery } from "@tanstack/react-query";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

const AllPost = () => {
	const [page, setPage] = useState(1);
	const limit = 10; // You can adjust this value as needed

	const {
		isLoading,
		isError,
		data: response,
		error,
		isPreviousData,
	} = useQuery({
		queryKey: ["posts", page],
		queryFn: () => allPosts(page, limit, true),
		keepPreviousData: true,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		staleTime: 1000 * 60 * 5,
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

	const { posts, currentPage, totalPages } = response?.data?.data || {};

	return (
		<Container className="my-10">
			<div className="flex justify-center items-center md:hidden">
				<Link to="/search" className="btn btn-primary ">
					<FiSearch />{" "}
				</Link>
			</div>
			<div className="flex justify-center mb-6 relative">
				<button
					onClick={() => setPage((old) => Math.max(old - 1, 1))}
					disabled={page === 1}
					className="btn btn-primary">
					Previous
				</button>
				<span className="px-4 py-2">
					Page {currentPage} of {totalPages}
				</span>
				<button
					onClick={() =>
						setPage((old) =>
							!isPreviousData && old < totalPages ? old + 1 : old
						)
					}
					disabled={isPreviousData || page === totalPages}
					className="btn btn-primary">
					Next
				</button>
				<Link
					to="/search"
					className="btn btn-primary absolute top-0 right-20 max-md:hidden">
					<FiSearch />{" "}
				</Link>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 md:px-10 lg:px-20">
				{posts?.map((post) => (
					<PostCard key={post._id} {...post} className="w-full" />
				))}
			</div>
		</Container>
	);
};

export default AllPost;
