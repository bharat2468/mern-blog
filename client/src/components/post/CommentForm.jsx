import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from "../../api/comments";

function CommentForm({ postId }) {
	const queryClient = useQueryClient();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();
	const [successMessage, setSuccessMessage] = useState(false);

	const { mutate, isPending, isError, error } = useMutation({
		mutationFn: create,
		onSuccess: () => {
			// Invalidate and refetch the comments query
			queryClient.refetchQueries(["comments", postId, 1]);

			// Show success message
			setSuccessMessage(true);

			// Hide success message after 1 second
			setTimeout(() => {
				setSuccessMessage(false);
			}, 1000);

			// Reset the form
			reset();
		},
		onError: () => {
			console.error("Comment adding failed:", error);
		},
	});

	const onSubmit = (formData) => {
		const newFormData = { postId, content: formData.content };
		mutate(newFormData);
	};

	return (
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

			{isError && (
				<p className="alert alert-error mt-4">
					Failed to post comment. Please try again.
				</p>
			)}
		</form>
	);
}

export default CommentForm;
