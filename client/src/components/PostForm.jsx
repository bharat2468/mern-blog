import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input, Loading, RTE } from "./index";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import slugify from "slugify";
import { createPost, updatePostData, updatePostImage } from "../api/posts";

function PostForm({ post }) {
	// !react hook form config
	const {
		register,
		handleSubmit,
		control,
		getValues,
		formState: { errors },
	} = useForm({
		defaultValues: {
			title: post?.title || "",
			content: post?.content || "",
			status: post?.status || "active",
			tags: post?.tags?.join(", ") || "",
			timeToRead: post?.timeToRead || "",
		},
	});

	//! logic implementation
	const navigate = useNavigate();
	const userData = useSelector((state) => state.auth.userData);
	const [imagePreview, setImagePreview] = useState(
		post?.featuredImage || null
	);

	// const { mutate, isLoading, isError, error } = useMutation({
	// 	mutationFn: login,
	// 	onSuccess: (response) => {
	// 		// Assuming the API returns user data on successful login
	//         console.log(response.data.data);
	// 		dispatch(loginAction(response.data.data));
	// 		navigate("/"); // Redirect to dashboard or home page
	// 	},
	// 	onError: (error) => {
	// 		console.error("Login failed:", error);
	// 		// Error is already captured in the `error` variable from useMutation
	// 	},
	// });

	const submit = async (data) => {
		// Generate slug from title
		const slug = slugify(data.title, { lower: true, strict: true });

		if (post) {
			// Update post logic
			console.log("Updating post:", { ...data, slug });
		} else {
			// Create post logic
			console.log("Creating new post:", { ...data, slug });
		}
		// Navigate or show success message
	};

	// !used for image preview
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const [isEditorLoading, setIsEditorLoading] = useState(true);

	return (
		<div className="relative">
			{isEditorLoading && (
				<div className="w-full h-full left-0 top-0 flex justify-center items-center absolute z-10 bg-base-100">
					<Loading className="w-20" />
				</div>
			)}
			{post ? (
				<h2 className="text-center text-2xl font-bold">Update Post</h2>
			) : (
				<h2 className="text-center text-2xl font-bold">Create Post</h2>
			)}
			<form
				onSubmit={handleSubmit(submit)}
				className="flex flex-col space-y-4 w-full max-w-3xl mx-auto">
				<Input
					label="Featured Image:"
					type="file"
					className="mb-4 file-input file-input-bordered"
					accept="image/png, image/jpg, image/jpeg, image/gif"
					{...register("image", { required: !post })}
					onChange={handleImageChange}
				/>
				{errors.image && (
					<p className="text-red-500 text-xs mt-1">
						This field is required
					</p>
				)}
				{imagePreview && (
					<div className="mt-2">
						<img
							src={imagePreview}
							alt="Preview"
							className="w-full h-72 object-cover rounded-lg"
						/>
					</div>
				)}

				<Input
					label="Title:"
					placeholder="Title"
					className="mb-4"
					{...register("title", { required: "Title is required" })}
				/>
				{errors.title && (
					<p className="text-red-500 text-xs mt-1">
						{errors.title.message}
					</p>
				)}

				<Input
					label="Tags (comma separated):"
					placeholder="tag1, tag2, tag3"
					className="mb-4"
					{...register("tags")}
				/>

				<Input
					label="Time to Read (in minutes):"
					type="number"
					placeholder="5"
					className="mb-4"
					{...register("timeToRead", {
						required: "Time to read is required",
					})}
				/>
				{errors.timeToRead && (
					<p className="text-red-500 text-xs mt-1">
						{errors.timeToRead.message}
					</p>
				)}

				<RTE
					label="Content:"
					name="content"
					control={control}
					defaultValue={getValues("content")}
					setIsEditorLoading={setIsEditorLoading}
					className=""
				/>
				{errors.content && (
					<p className="text-red-500 text-xs mt-1">
						{errors.content.message}
					</p>
				)}

				<button
					type="submit"
					className={`btn ${post ? "btn-success" : "btn-primary"} w-full mt-4`}>
					{post ? "Update Post" : "Create Post"}
				</button>
			</form>
		</div>
	);
}

export default PostForm;
