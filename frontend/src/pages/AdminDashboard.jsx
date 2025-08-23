import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api.js';
import Layout from '../components/Layout.jsx';

export default function AdminDashboard() {
	const [users, setUsers] = useState([]);
	const [accounts, setAccounts] = useState([]);
	const [txns, setTxns] = useState([]);

	const load = async () => {
		const [u, a, t] = await Promise.all([
			api.get('/users'),
			api.get('/accounts'),
			api.get('/transactions'),
		]);
		setUsers(u.data);
		setAccounts(a.data);
		setTxns(t.data);
	};

	useEffect(() => { load(); }, []);

	const updateStatus = async (accountNumber, status) => {
		try {
			await api.patch(`/accounts/${accountNumber}/status`, { status });
			toast.success(`Account ${status}`);
			await load();
		} catch (e) {
			toast.error(e.response?.data?.message || 'Failed');
		}
	};

	return (
		<Layout>
			<div className="space-y-8">
				<section>
					<h2 className="text-lg font-semibold mb-3">Users</h2>
					<div className="bg-white rounded shadow overflow-x-auto">
						<table className="min-w-full text-sm">
							<thead className="bg-gray-50">
								<tr>
									<th className="p-2 text-left">Name</th>
									<th className="p-2 text-left">Email</th>
									<th className="p-2 text-left">Phone</th>
									<th className="p-2 text-left">Role</th>
								</tr>
							</thead>
							<tbody>
								{users.map((u) => (
									<tr key={u._id} className="border-t">
										<td className="p-2">{u.name}</td>
										<td className="p-2">{u.email}</td>
										<td className="p-2">{u.phone}</td>
										<td className="p-2">{u.role}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>

				<section>
					<h2 className="text-lg font-semibold mb-3">Accounts</h2>
					<div className="bg-white rounded shadow overflow-x-auto">
						<table className="min-w-full text-sm">
							<thead className="bg-gray-50">
								<tr>
									<th className="p-2 text-left">Account</th>
									<th className="p-2 text-left">Type</th>
									<th className="p-2 text-left">Balance</th>
									<th className="p-2 text-left">Status</th>
									<th className="p-2"></th>
								</tr>
							</thead>
							<tbody>
								{accounts.map((a) => (
									<tr key={a.accountNumber} className="border-t">
										<td className="p-2">{a.accountNumber}</td>
										<td className="p-2">{a.type}</td>
										<td className="p-2">₹{a.balance}</td>
										<td className="p-2">{a.status}</td>
										<td className="p-2 text-right space-x-2">
											<button className="btn" onClick={() => updateStatus(a.accountNumber, 'suspended')}>Suspend</button>
											<button className="btn" onClick={() => updateStatus(a.accountNumber, 'active')}>Activate</button>
											<button className="btn" onClick={() => updateStatus(a.accountNumber, 'closed')}>Close</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>

				<section>
					<h2 className="text-lg font-semibold mb-3">Recent Transactions</h2>
					<div className="bg-white rounded shadow divide-y">
						{txns.map((t) => (
							<div key={t._id} className="p-3 text-sm grid grid-cols-4 gap-2">
								<span>{t.type}</span>
								<span>₹{t.amount}</span>
								<span>{t.fromAccount || '-'}</span>
								<span>{t.toAccount || '-'}</span>
							</div>
						))}
						{txns.length === 0 && <div className="p-3 text-sm text-gray-500">No transactions</div>}
					</div>
				</section>
			</div>
		</Layout>
	);
}