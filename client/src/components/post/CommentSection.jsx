import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CommentItem from "./CommentItem";
import { Loading, Error } from "../index";
import { getCommentsForPost, create } from "../../api/comments";

function CommentSection({ postId }) {
	// State for pagination and storing all comments
	const [page, setPage] = useState(1);
	const limit = 2; // You can adjust this value as needed
	const queryClient = useQueryClient();
    const [allComments, setAllComments] = useState([]);
	const [successMessage, setSuccessMessage] = useState(false);

	// Fetch comments query
	const {
		data: response,
		error,
		isLoading,
		isError,
		isFetching,
	} = useQuery({
		queryKey: ["comments", postId, page],
		queryFn: () => getCommentsForPost(postId, page, limit),
		staleTime: 1000 * 60 * 5,
		keepPreviousData: true, // Keeps previous data while fetching the next page
	});

	// Handle comment form submission
	const { register, handleSubmit, reset, formState: { errors } } = useForm();
	const { mutate, isPending, isError: isFormError } = useMutation({
		mutationFn: create,
		onSuccess: () => {
			// Refetch the comments and reset pagination
			queryClient.refetchQueries(["comments", postId, 1]);
			setPage(1); // Reset to first page to display the latest comments
			setSuccessMessage(true); // Show success message

			// Hide success message after 1 second
			setTimeout(() => setSuccessMessage(false), 1000);

			reset(); // Reset the form
		},
		onError: () => console.error("Comment adding failed:", error),
	});

	const onSubmit = (formData) => {
		const newFormData = { postId, content: formData.content };
		mutate(newFormData);
	};

	// Update comments when response changes
	useEffect(() => {
		if (response?.data?.data?.comments) {
            const newComments = response?.data?.data?.comments || [];
            if(page === 1){
                setAllComments(newComments);
            }
            else{
                setAllComments((prevComments) => {
                    // Use a Map to avoid adding duplicate comments
                    const uniqueComments = new Map();
                    [...prevComments,...newComments].forEach((comment) =>
                        uniqueComments.set(comment._id, comment)
                    );
                    return Array.from(uniqueComments.values());
                });
            }
		}
	}, [response]);

	// Reset comments and page when postId changes
	useEffect(() => {
		setAllComments([]);
		setPage(1);
	}, [postId]);

	const loadMoreComments = () => {
		if (!isFetching) setPage((prevPage) => prevPage + 1);
	};

	// Rendering the form, comments, and pagination
	return (
		<div>
			{/* Comment Form */}
			<form onSubmit={handleSubmit(onSubmit)} className="mb-6">
				{successMessage && (
					<p className="alert alert-success my-4">
						Comment posted successfully!
					</p>
				)}
				<div className="mb-4">
					<textarea
						{...register("content", {
							required: "Comment is required",
						})}
						className="w-full p-2 border rounded-md"
						rows="3"
						placeholder="Add a comment..."
						disabled={isPending} // Disable textarea during submission
					></textarea>
					{errors.content && (
						<p className="text-red-500">{errors.content.message}</p>
					)}
				</div>
				<button
					type="submit"
					className="px-4 py-2 bg-primary text-primary-content rounded-md hover:bg-primary-focus"
					disabled={isPending}>
					{isPending ? "Posting..." : "Post Comment"}
				</button>

				{isFormError && (
					<p className="alert alert-error mt-4">
						Failed to post comment. Please try again.
					</p>
				)}
			</form>

			{/* Comment List */}
			<div className="space-y-4">
				{isLoading && page === 1 ? (
					<Loading />
				) : isError ? (
					<Error error={error} />
				) : (
					allComments.map((comment) => (
						<CommentItem key={comment._id} comment={comment} />
					))
				)}
				{isFetching && <Loading />}
				{response?.data?.data?.currentPage < response?.data?.data?.totalPages && (
					<button
						onClick={loadMoreComments}
						disabled={isFetching}
						className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400">
						{isFetching ? "Loading more..." : "Show More"}
					</button>
				)}
			</div>
		</div>
	);
}

export default CommentSection;
