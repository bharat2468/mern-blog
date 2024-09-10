// import { FaRegClock } from "react-icons/fa6";
// import { FaRegHeart, FaRegCalendarAlt } from "react-icons/fa";

// function Post({ post }) {
// 	return (
// 		<article className="lg:w-[50%] w-[70%]">
// 			<div className="relative mb-8 overflow-hidden rounded-xl mx-auto">
// 				<img
// 					src={post.featuredImage || "/placeholder.svg"}
// 					alt={post.title}
// 					className="aspect-video w-full object-cover"
// 				/>
// 				<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-base-100 px-4 py-6 md:px-6 lg:py-8">
// 					<div className="flex items-center justify-between">
// 						<div className="space-x-2">
// 							{post.tags.map((tag) => (
// 								<div
// 									key={tag}
// 									className="badge badge-outline bg-primary text-primary-content">
// 									{tag}
// 								</div>
// 							))}
// 						</div>
// 						<div className="text-sm text-muted">
// 							<FaRegClock className="mr-1 inline-block h-4 w-4" />
// 							{post.timeToRead} min read
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 			<div className="space-y-4">
// 				<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
// 					{post.title}
// 				</h1>
// 				<div className="flex items-center space-x-4 text-sm text-muted">
// 					<div>
// 						<FaRegCalendarAlt className="mr-1 inline-block h-4 w-4" />
// 						<time dateTime={post.createdAt}>
// 							{new Date(post.createdAt).toLocaleDateString()}
// 						</time>
// 					</div>
// 					<div>
// 						<FaRegCalendarAlt className="mr-1 inline-block h-4 w-4" />
// 						<time dateTime={post.updatedAt}>
// 							Updated on{" "}
// 							{new Date(post.updatedAt).toLocaleDateString()}
// 						</time>
// 					</div>
// 					<div>
// 						<FaRegHeart className="mr-1 inline-block h-4 w-4" />
// 						<span>{post.likesCount} likes</span>
// 					</div>
// 				</div>
// 				<p>{post.content}</p>
// 				<h2>Comments</h2>
// 				{/* <div className="space-y-4">
// 					{post.comments.map((comment) => (
// 						<div
// 							key={comment._id}
// 							className="rounded-lg bg-base-200 p-4 shadow">
// 							<div className="flex items-start gap-4">
// 								<div className="avatar h-10 w-10 shrink-0 border">
// 									<div className="rounded-full w-10 h-10">
// 										<img
// 											src={
// 												comment.user.avatar ||
// 												"/placeholder-user.jpg"
// 											}
// 											alt={comment.user.username}
// 										/>
// 									</div>
// 								</div>
// 								<div className="flex-1">
// 									<div className="flex items-center justify-between">
// 										<div className="font-medium">
// 											{comment.user.username}
// 										</div>
// 										<div className="text-sm text-muted">
// 											<time dateTime={comment.createdAt}>
// 												{new Date(
// 													comment.createdAt
// 												).toLocaleDateString()}
// 											</time>
// 										</div>
// 									</div>
// 									<p className="mt-2">{comment.content}</p>
// 									<div className="text-sm text-muted">
// 										<FaRegHeart className="mr-1 inline-block h-4 w-4" />
// 										{comment.likes} likes
// 									</div>
// 								</div>
// 							</div>
// 						</div>
// 					))}
// 				</div> */}
// 			</div>
// 		</article>
// 	);
// }

// export default Post;

// Post.jsx
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import CommentSection from "./CommentSection";

function Post({ post }) {
	return (
		<article className="lg:w-[50%] md:w-[70%] w-[92%]">
			<PostHeader post={post} />
			<PostContent post={post} />
			<CommentSection postId={post._id} />
		</article>
	);
}

export default Post;
