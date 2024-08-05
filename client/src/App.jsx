import { Header, Footer, Loading } from "./components";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "./api/users";
import { login, logout } from "./store/authSlice";
import { useEffect } from "react";

function App() {
	const dispatch = useDispatch();

	const {
		isLoading,
		isError,
		data: response,
		error,
	} = useQuery({
		queryKey: ["currentUser"],
		queryFn: getCurrentUser,
		retry: 1,
		refetchOnWindowFocus: false, // Disable automatic refetching on window focus
		refetchOnMount: false,     // Disable automatic refetching on component mount
		staleTime: 1000 * 60 * 60,
	});

	useEffect(() => {
		if (isLoading) {
			return; // Handle loading state separately
		}

		if (isError) {
			console.log(error);
			dispatch(logout());
		} else {
			dispatch(login(response.data.data));
		}
	}, [isLoading, isError, response, dispatch]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex justify-center items-center">
				<Loading className="w-32" />
			</div>
		);
	}

	
	return (
		<div className="wrapper min-h-screen">
			<Header />
			<Outlet />
			<Footer />
		</div>
	);
}

export default App;
