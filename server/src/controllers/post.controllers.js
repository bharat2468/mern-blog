import { asyncHandler } from "../utils/asyncHandler.js";
import { Post } from "../models/post.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
	deleteFromCloudinary,
	uploadOnCloudinary,
} from "../utils/cloudinary.js";
import slugify from "slugify";

const allPosts = asyncHandler(async (req, res) => {
	const pagination = req.query.pagination === "true";
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 9;
	const skip = (page - 1) * limit;

	const totalPosts = await Post.countDocuments();

	let pipeline = [
		{
			$sort: {
				createdAt: -1,
			},
		},
	];

	if (pagination) {
		pipeline.push({ $skip: skip });
		pipeline.push({ $limit: limit });
	}

	const posts = await Post.aggregate(pipeline);

	const response = {
		posts,
		totalPosts,
	};

	if (pagination) {
		response.currentPage = page;
		response.totalPages = Math.ceil(totalPosts / limit);
	}

	return res
		.status(200)
		.json(new ApiResponse(200, response, "Posts returned successfully"));
});


const getPost = asyncHandler(async (req, res) => {
	const slug = req.params?.slug;

	const pipeline = [
		// Match the specific post by ID
		{
			$match: {
				slug,
			},
		},
		// Lookup likes for the post
		{
			$lookup: {
				from: "likes",
				localField: "_id",
				foreignField: "postId",
				as: "postLikes",
			},
		},
		// Add a field for the post likes count
		{
			$addFields: {
				likesCount: { $size: "$postLikes" },
			},
		},
		// Project to shape the final post data
		{
			$project: {
				_id: 1,
				title: 1,
				slug: 1,
				featuredImage: 1,
				tags: 1,
				timeToRead: 1,
				content: 1,
				createdAt: 1,
				updatedAt: 1,
				likesCount: 1,
			},
		},
	];

	const result = await Post.aggregate(pipeline);

	if (result.length === 0) {
		throw new ApiError(404, "Post not found");
	}

	return res
		.status(200)
		.json(new ApiResponse(200, result, "fetched post successfully"));
});

const createPost = asyncHandler(async (req, res) => {
	console.log(req.body);
	console.log(req.file);
	const { title, timeToRead, content } = req.body;

	const imageLocalPath = req?.file?.path;
	const tags = req.body.tags.split(",");

	if (!imageLocalPath) {
		throw new ApiError(400, "featuredImage is required");
	}

	const imageCloudObject = await uploadOnCloudinary(imageLocalPath);

	const imageCloudUrl = imageCloudObject?.url;

	if (!imageCloudUrl) {
		throw new ApiError(
			500,
			"Something went wrong while uploading image on cloudinary"
		);
	}

	// Generate initial slug
	let slug = slugify(title, { lower: true, strict: true });

	// Check if slug already exists and make it unique if necessary
	let slugExists = await Post.findOne({ slug });
	let counter = 1;
	while (slugExists) {
		slug = `${slug}-${Date.now()}-${counter}`;
		slugExists = await Post.findOne({ slug });
		counter++;
	}

	const existingPost = await Post.findOne({ title });

	if (existingPost) {
		throw new ApiError(400, "post with title already exists");
	}

	const post = await Post.create({
		title,
		slug,
		featuredImage: imageCloudUrl,
		tags,
		content,
		timeToRead,
	});

	const createdPost = await Post.findById(post?._id);

	if (!createdPost) {
		throw new ApiError(
			500,
			"Something went wrong while creating the post in the database"
		);
	}

	return res
		.status(201)
		.json(new ApiResponse(201, createdPost, "Post created Successfully"));
});

const updatePostData = asyncHandler(async (req, res) => {
	const { title, timeToRead, content } = req.body;

	const tags = req?.body?.tags?.split(",");
	const postId = req.params?.postId;
	console.log(postId);

	let updateData = {
		...(timeToRead && { timeToRead }),
		...(content && { content }),
		...(tags && { tags }),
	};

	if (title) {
		updateData.title = title;

		// Generate new slug if title is updated
		let newSlug = slugify(title, { lower: true, strict: true });

		// Check if new slug already exists and make it unique if necessary
		let slugExists = await Post.findOne({
			slug: newSlug,
			_id: { $ne: postId },
		});
		let counter = 1;
		while (slugExists) {
			newSlug = `${newSlug}-${Date.now()}-${counter}`;
			slugExists = await Post.findOne({
				slug: newSlug,
				_id: { $ne: postId },
			});
			counter++;
		}

		updateData.slug = newSlug;
	}

	const post = await Post.findByIdAndUpdate(postId, updateData, {
		new: true,
	});

	if (!post) {
		throw new ApiError(404, "Post not found");
	}

	// Return updated post
	return res
		.status(200)
		.json(new ApiResponse(200, post, "Post updated successfully"));
});

const updatePostImage = asyncHandler(async (req, res) => {
	// get new avatar file -> error
	// upload new on cloudinary -> error
	// update in the database
	// delete prev from db
	console.log(req.body);
	console.log(req.file);
	const postId = req.params?.postId;

	const newImageLocalPath = req?.file?.path;

	if (!newImageLocalPath) {
		throw new ApiError(400, "new image file required");
	}

	const newImageCloudObject = await uploadOnCloudinary(newImageLocalPath);

	const newImageCloudUrl = newImageCloudObject?.url;
	// const newAvatarPublicId = newAvatarCloudObject?.public_id;

	if (!newImageCloudUrl) {
		throw new ApiError(
			500,
			"unable to upload new image file on cloudinary"
		);
	}

	const post = await Post.findByIdAndUpdate(postId, {
		$set: {
			featuredImage: newImageCloudUrl,
		},
	});

	const oldImageUrl = post.featuredImage;
	const publicId = oldImageUrl
		? oldImageUrl.split("/").slice(-1)[0].split(".")[0]
		: null;

	await deleteFromCloudinary(publicId);

	post.featuredImage = newImageCloudUrl;

	return res
		.status(200)
		.json(new ApiResponse(200, post, "post image changed successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
	const postId = req.params?.postId;

	const deletedPost = await Post.findByIdAndDelete(postId);

	if (!deletedPost) {
		throw new ApiError(
			500,
			"Post does not exist or Something went wrong while deleting the post"
		);
	}

	return res
		.status(200)
		.json(new ApiResponse(200, deletedPost, "post deleted successfully"));
});

const searchPost = asyncHandler(async (req, res) => {
	const { searchString, dateFrom, dateTo } = req.query;

	// Build the aggregation pipeline
	let pipeline = [];

	// Match stage for title or tags
	if (searchString) {
		pipeline.push({
			$match: {
				$or: [
					{ title: { $regex: searchString, $options: "i" } }, // Case-insensitive search in title
					{ tags: { $regex: searchString, $options: "i" } }, // Case-insensitive search in tags
					{ slug: { $regex: searchString, $options: "i" } },
				],
			},
		});
	}

	// Match stage for date range
	if (dateFrom || dateTo) {
		let dateMatch = {};
		if (dateFrom) dateMatch.$gte = new Date(dateFrom);
		if (dateTo) dateMatch.$lte = new Date(dateTo);
		console.log(dateMatch);
		pipeline.push({
			$match: {
				createdAt: dateMatch,
			},
		});
	}

	// Execute the aggregation pipeline
	const posts = await Post.aggregate(pipeline);

	// Send the matched posts as a response
	return res
		.status(200)
		.json(new ApiResponse(200, posts, "Fetched posts successfully"));
});

export {
	allPosts,
	getPost,
	createPost,
	updatePostData,
	updatePostImage,
	deletePost,
	searchPost,
};
