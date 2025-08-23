import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CustomerDashboard from './pages/CustomerDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import { useAuth } from './hooks/useAuth.js';

const ProtectedRoute = ({ children, role }) => {
	const { user } = useAuth();
	if (!user) return <Navigate to="/login" replace />;
	if (role && user.role !== role) return <Navigate to="/" replace />;
	return children;
};

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/dashboard" replace />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<RegisterPage />} />
			<Route
				path="/dashboard"
				element={
					<ProtectedRoute>
						<CustomerDashboard />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/admin"
				element={
					<ProtectedRoute role="admin">
						<AdminDashboard />
					</ProtectedRoute>
				}
			/>
		</Routes>
	);
}