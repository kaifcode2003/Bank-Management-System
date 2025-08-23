import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../lib/api.js';
import { useAuth } from '../hooks/useAuth.js';

export default function RegisterPage() {
	const navigate = useNavigate();
	const { setAuth } = useAuth();
	const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
	const [loading, setLoading] = useState(false);

	const submit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const { data } = await api.post('/auth/register', form);
			setAuth(data);
			toast.success('Registered');
			navigate('/dashboard');
		} catch (err) {
			toast.error(err.response?.data?.message || 'Registration failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen grid place-items-center">
			<form onSubmit={submit} className="bg-white shadow rounded p-6 w-full max-w-md space-y-4">
				<h1 className="text-xl font-semibold">Register</h1>
				<input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" required />
				<input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" required />
				<input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" required />
				<input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" required />
				<button className="btn btn-primary w-full" disabled={loading}>{loading ? '...' : 'Create account'}</button>
				<p className="text-sm text-center">Have an account? <Link className="text-blue-600" to="/login">Login</Link></p>
			</form>
		</div>
	);
}