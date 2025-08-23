import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../lib/api.js';
import { useAuth } from '../hooks/useAuth.js';

export default function LoginPage() {
	const navigate = useNavigate();
	const { setAuth } = useAuth();
	const [email, setEmail] = useState('customer@bankmate.local');
	const [password, setPassword] = useState('Customer@12345');
	const [loading, setLoading] = useState(false);

	const submit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const { data } = await api.post('/auth/login', { email, password });
			setAuth(data);
			toast.success('Logged in');
			navigate('/dashboard');
		} catch (err) {
			toast.error(err.response?.data?.message || 'Login failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen grid place-items-center">
			<form onSubmit={submit} className="bg-white shadow rounded p-6 w-full max-w-md space-y-4">
				<h1 className="text-xl font-semibold">Login</h1>
				<input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
				<input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
				<button className="btn btn-primary w-full" disabled={loading}>{loading ? '...' : 'Login'}</button>
				<p className="text-sm text-center">No account? <Link className="text-blue-600" to="/register">Register</Link></p>
			</form>
		</div>
	);
}