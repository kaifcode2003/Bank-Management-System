import { randomInt } from 'crypto';

export const generateAccountNumber = () => {
	const prefix = '10';
	const body = String(randomInt(0, 1_000_000_000)).padStart(9, '0');
	return `${prefix}${body}`;
};