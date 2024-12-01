import React, { useContext } from 'react';
import { UserContext } from '@/App';
import LoginForm from "@/ui/LoginForm";
import api from '@/api';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
	const { setUser } = useContext(UserContext);
	const navigate = useNavigate();

	const handleLogin = async (userData) => {
		const resp = await api.loginUser(userData);
		if (resp.status === "ok") {
			setUser(api.getUser());
			navigate("/account");
		}
		return resp;
	};

	return (
		<main className="flex justify-center items-center min-h-[calc(100vh-12rem)] bg-white">
            <div className="w-full max-w-md p-8 bg-white shadow-md">
				<h3 className="text-2xl font-semibold text-center mb-6">Login to your account</h3>
				<LoginForm onSubmit={handleLogin} />
			</div>
		</main>
	);
}
