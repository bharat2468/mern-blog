// PostContent.jsx
import { FaRegCalendarAlt, FaRegHeart } from "react-icons/fa";

function PostContent({ post }) {
	return (
		<div className="space-y-4 my-10">
			<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
				{post.title}
			</h1>
			<div className="flex items-center space-x-4 text-sm text-muted">
				<div>
					<FaRegCalendarAlt className="mr-1 inline-block h-4 w-4" />
					<time dateTime={post.createdAt}>
						{new Date(post.createdAt).toLocaleDateString()}
					</time>
				</div>
				<div>
					<FaRegCalendarAlt className="mr-1 inline-block h-4 w-4" />
					<time dateTime={post.updatedAt}>
						Updated on {new Date(post.updatedAt).toLocaleDateString()}
					</time>
				</div>
				<div>
					<FaRegHeart className="mr-1 inline-block h-4 w-4" />
					<span>{post.likesCount} likes</span>
				</div>
			</div>
			<p dangerouslySetInnerHTML={{ __html: post.content }}></p>
		</div>
	);
}

export default PostContent;