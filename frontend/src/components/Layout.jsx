import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export default function Layout({ children }) {
	const { user, logout } = useAuth();
	return (
		<div className="min-h-screen flex flex-col">
			<header className="bg-white border-b">
				<div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
					<Link to="/" className="font-semibold text-lg">BankMate</Link>
					<nav className="flex items-center gap-4">
						<NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'text-blue-600' : 'text-gray-600')}>Dashboard</NavLink>
						{user?.role === 'admin' && (
							<NavLink to="/admin" className={({ isActive }) => (isActive ? 'text-blue-600' : 'text-gray-600')}>Admin</NavLink>
						)}
						<button onClick={logout} className="ml-2 text-sm text-red-600">Logout</button>
					</nav>
				</div>
			</header>
			<main className="flex-1">
				<div className="max-w-6xl mx-auto px-4 py-6">{children}</div>
			</main>
		</div>
	);
}