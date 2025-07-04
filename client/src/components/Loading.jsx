const Loading = ({ className = "" }) => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen text-center space-y-4 px-4">
			<span className={`loading loading-infinity loading-lg text-primary ${className}`} />
			<h2 className="text-lg font-semibold text-gray-700">Waking up the server...</h2>
			<p className="text-sm text-gray-500 max-w-md">
				This may take a few seconds since the backend is hosted on Render’s free tier, which sleeps when idle.
				We appreciate your patience! ☕
			</p>
		</div>
	);
};

export default Loading;
