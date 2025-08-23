import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api.js';
import Layout from '../components/Layout.jsx';

export default function CustomerDashboard() {
	const [accounts, setAccounts] = useState([]);
	const [selected, setSelected] = useState('');
	const [amount, setAmount] = useState('');
	const [history, setHistory] = useState([]);

	const load = async () => {
		const { data } = await api.get('/accounts/mine');
		setAccounts(data);
		if (data[0]) setSelected(data[0].accountNumber);
	};

	const loadHistory = async (acc) => {
		if (!acc) return;
		const { data } = await api.get(`/transactions/history/${acc}`);
		setHistory(data);
	};

	useEffect(() => {
		load();
	}, []);

	useEffect(() => {
		loadHistory(selected);
	}, [selected]);

	const doAction = async (type) => {
		try {
			const amt = parseFloat(amount);
			if (!amt || amt <= 0) return toast.error('Enter amount > 0');
			if (type === 'deposit') await api.post('/transactions/deposit', { accountNumber: selected, amount: amt });
			if (type === 'withdraw') await api.post('/transactions/withdraw', { accountNumber: selected, amount: amt });
			toast.success(`${type} successful`);
			setAmount('');
			await load();
			await loadHistory(selected);
		} catch (e) {
			toast.error(e.response?.data?.message || 'Failed');
		}
	};

	const [transfer, setTransfer] = useState({ to: '', amount: '' });
	const doTransfer = async () => {
		try {
			const amt = parseFloat(transfer.amount);
			if (!amt || amt <= 0) return toast.error('Enter amount > 0');
			await api.post('/transactions/transfer', { fromAccountNumber: selected, toAccountNumber: transfer.to, amount: amt });
			toast.success('Transfer successful');
			setTransfer({ to: '', amount: '' });
			await load();
			await loadHistory(selected);
		} catch (e) {
			toast.error(e.response?.data?.message || 'Failed');
		}
	};

	return (
		<Layout>
			<div className="grid md:grid-cols-3 gap-6">
				<section className="md:col-span-2">
					<h2 className="text-lg font-semibold mb-3">My Accounts</h2>
					<div className="space-y-2">
						<select value={selected} onChange={(e) => setSelected(e.target.value)} className="input w-full">
							<option value="">Select account</option>
							{accounts.map((a) => (
								<option key={a.accountNumber} value={a.accountNumber}>
									{a.accountNumber} — {a.type} — ₹{a.balance}
								</option>
							))}
						</select>
						<div className="flex gap-2">
							<input className="input" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
							<button className="btn" onClick={() => doAction('deposit')}>Deposit</button>
							<button className="btn" onClick={() => doAction('withdraw')}>Withdraw</button>
						</div>
					</div>

					<h2 className="text-lg font-semibold mt-6 mb-3">Transfer</h2>
					<div className="flex gap-2">
						<input className="input" placeholder="To Account" value={transfer.to} onChange={(e) => setTransfer({ ...transfer, to: e.target.value })} />
						<input className="input" placeholder="Amount" value={transfer.amount} onChange={(e) => setTransfer({ ...transfer, amount: e.target.value })} />
						<button className="btn" onClick={doTransfer}>Send</button>
					</div>
				</section>

				<section>
					<h2 className="text-lg font-semibold mb-3">History</h2>
					<div className="bg-white rounded shadow divide-y">
						{history.map((t) => (
							<div key={t._id} className="p-3 text-sm flex justify-between">
								<span>{t.type}</span>
								<span>₹{t.amount}</span>
								<span>{new Date(t.createdAt).toLocaleString()}</span>
							</div>
						))}
						{history.length === 0 && <div className="p-3 text-sm text-gray-500">No transactions</div>}
					</div>
				</section>
			</div>
		</Layout>
	);
}