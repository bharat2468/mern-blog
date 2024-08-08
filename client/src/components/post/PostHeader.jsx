// PostHeader.jsx
import { FaRegClock } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link,useNavigate } from "react-router-dom";

function PostHeader({ post }) {
	const user = useSelector((state) => state.auth.user);
	const isAdmin = user?.role === "admin";
	const navigate = useNavigate();
	return (
		<div className="relative mb-8 overflow-hidden rounded-xl mx-auto">
			{isAdmin && (
				<div className="flex my-4 justify-end">
					<div className="btn btn-sm btn-outline btn-accent"
					onClick={() => {
						navigate(`/add-update-post`, { state: { post } });
					}}>
						Edit
					</div>
				</div>
			)}
			<img
				src={post.featuredImage || "/placeholder.svg"}
				alt={post.title}
				className="aspect-video w-full object-cover"
			/>
			<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-base-100 px-4 py-6 md:px-6 lg:py-8">
				<div className="flex items-center justify-between">
					<div className="space-x-2">
						{post.tags.map((tag,index) => (
							<div
								key={index}
								className="badge badge-outline bg-primary text-primary-content">
								{tag}
							</div>
						))}
					</div>
					<div className="text-sm text-muted">
						<FaRegClock className="mr-1 inline-block h-4 w-4" />
						{post.timeToRead} min read
					</div>
				</div>
			</div>
		</div>
	);
}

export default PostHeader;
