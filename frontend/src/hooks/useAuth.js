import { useEffect, useState } from 'react';

const storageKey = 'bankmate_auth';

export const getStoredAuth = () => {
	try {
		const raw = localStorage.getItem(storageKey);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
};

export const setStoredAuth = (auth) => {
	localStorage.setItem(storageKey, JSON.stringify(auth));
};

export const clearStoredAuth = () => {
	localStorage.removeItem(storageKey);
};

export function useAuth() {
	const [auth, setAuth] = useState(() => getStoredAuth());

	useEffect(() => {
		if (auth) setStoredAuth(auth);
	}, [auth]);

	return {
		token: auth?.token || null,
		user: auth?.user || null,
		setAuth,
		logout: () => {
			clearStoredAuth();
			setAuth(null);
		},
	};
}