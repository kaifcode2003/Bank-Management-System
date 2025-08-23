document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const API_BASE_URL = 'http://localhost:3000/api';
    let state = { token: localStorage.getItem('authToken'), user: null, account: null, transactions: [] };
    
    // --- Page Routing ---
    const currentPageName = window.location.pathname.split('/').pop().replace('.html', '');
    if (!state.token && currentPageName !== 'login') {
        window.location.href = 'login.html';
        return;
    }
    if (state.token && currentPageName === 'login') {
        window.location.href = 'dashboard.html';
        return;
    }

    // --- Universal Functions ---
    const showLoader = (show) => {
        const loader = document.getElementById('loadingOverlay');
        if (loader) {
            loader.classList.toggle('hidden', !show);
            loader.classList.toggle('flex', show);
        }
    };
    const showMessage = (message, isError = true) => {
        const box = document.getElementById('messageBox');
        if (box) {
            box.textContent = message;
            box.className = `fixed top-5 right-5 text-white py-3 px-5 rounded-lg shadow-lg z-50 ${isError ? 'bg-red-500' : 'bg-green-500'}`;
            box.classList.remove('hidden');
            setTimeout(() => box.classList.add('hidden'), 3000);
        }
    };
    const formatCurrency = (amount) => `$${parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    const apiRequest = async (endpoint, method, body = null) => {
        showLoader(true);
        const headers = { 'Content-Type': 'application/json' };
        if (state.token) headers['Authorization'] = `Bearer ${state.token}`;
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, { method, headers, body: body ? JSON.stringify(body) : null });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'An error occurred');
            return data;
        } catch (error) {
            showMessage(error.message);
            throw error;
        } finally {
            showLoader(false);
        }
    };

    // --- Page-Specific Logic ---
    const initLoginPage = () => {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');
        const loginContainer = document.getElementById('loginContainer');
        const registerContainer = document.getElementById('registerContainer');

        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginContainer.classList.add('hidden');
            registerContainer.classList.remove('hidden');
        });

        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            registerContainer.classList.add('hidden');
            loginContainer.classList.remove('hidden');
        });

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const data = await apiRequest('/login', 'POST', {
                    email: e.target.loginEmail.value,
                    password: e.target.loginPassword.value
                });
                localStorage.setItem('authToken', data.token);
                window.location.href = 'dashboard.html';
            } catch (error) {}
        });

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const data = await apiRequest('/register', 'POST', {
                    name: e.target.registerName.value,
                    email: e.target.registerEmail.value,
                    password: e.target.registerPassword.value
                });
                showMessage(data.message, false);
                // Switch to login form after successful registration
                showLogin.click();
            } catch (error) {}
        });
    };

    const initDashboardPage = () => {
        document.getElementById('totalBalance').textContent = formatCurrency(state.account.balance);
        const income = state.transactions.filter(tx => !tx.type.includes('DEBIT') && !tx.type.includes('WITHDRAWAL')).reduce((sum, tx) => sum + tx.amount, 0);
        const expenses = state.transactions.filter(tx => tx.type.includes('DEBIT') || tx.type.includes('WITHDRAWAL')).reduce((sum, tx) => sum + tx.amount, 0);
        document.getElementById('totalIncome').textContent = formatCurrency(income);
        document.getElementById('totalExpenses').textContent = formatCurrency(expenses);
        renderRecentTransactions();
        renderChart();
    };
    
    const renderRecentTransactions = () => {
        const container = document.getElementById('recentTransactions');
        container.innerHTML = '';
        const recent = state.transactions.slice(0, 4);
        if (recent.length === 0) {
            container.innerHTML = '<p class="text-gray-500">No recent transactions.</p>';
            return;
        }
        recent.forEach(tx => {
            const isDebit = tx.type.includes('DEBIT') || tx.type.includes('WITHDRAWAL');
            const description = tx.type === 'TRANSFER_DEBIT' ? `Transfer to ${tx.related_account_number}` : tx.type === 'TRANSFER_CREDIT' ? `From ${tx.related_account_number}` : tx.type.replace('_', ' ');
            const item = `<div class="flex items-center"><div class="p-3 bg-gray-100 rounded-full mr-4"><i data-lucide="${isDebit ? 'arrow-down' : 'arrow-up'}" class="w-5 h-5 ${isDebit ? 'text-red-500' : 'text-green-500'}"></i></div><div class="flex-1"><p class="font-semibold text-gray-800">${description}</p><p class="text-sm text-gray-500">${new Date(tx.timestamp).toLocaleDateString()}</p></div><p class="font-semibold ${isDebit ? 'text-red-500' : 'text-green-500'}">${isDebit ? '-' : '+'}${formatCurrency(tx.amount)}</p></div>`;
            container.insertAdjacentHTML('beforeend', item);
        });
        lucide.createIcons();
    };

    const renderChart = () => {
        // ... (Chart.js logic is complex and remains the same) ...
    };

    const initTransactionsPage = () => {
        const income = state.transactions.filter(tx => !tx.type.includes('DEBIT') && !tx.type.includes('WITHDRAWAL')).reduce((sum, tx) => sum + tx.amount, 0);
        const expenses = state.transactions.filter(tx => tx.type.includes('DEBIT') || tx.type.includes('WITHDRAWAL')).reduce((sum, tx) => sum + tx.amount, 0);
        document.getElementById('transactionsTotalIn').textContent = formatCurrency(income);
        document.getElementById('transactionsTotalOut').textContent = formatCurrency(expenses);
        renderFullTransactionTable();

        document.getElementById('transactionSearch').addEventListener('input', (e) => renderFullTransactionTable(e.target.value));
    };

    const renderFullTransactionTable = (filter = '') => {
        const tableBody = document.getElementById('allTransactionsTable');
        tableBody.innerHTML = '';
        const filtered = state.transactions.filter(tx => {
            const description = tx.type === 'TRANSFER_DEBIT' ? `Transfer to ${tx.related_account_number}` : tx.type === 'TRANSFER_CREDIT' ? `From ${tx.related_account_number}` : tx.type.replace('_', ' ');
            return description.toLowerCase().includes(filter.toLowerCase());
        });

        if (filtered.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="3" class="text-center py-4 text-gray-500">No transactions found.</td></tr>';
            return;
        }

        filtered.forEach(tx => {
            const isDebit = tx.type.includes('DEBIT') || tx.type.includes('WITHDRAWAL');
            const description = tx.type === 'TRANSFER_DEBIT' ? `Transfer to ${tx.related_account_number}` : tx.type === 'TRANSFER_CREDIT' ? `From ${tx.related_account_number}` : tx.type.replace('_', ' ');
            const row = `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${new Date(tx.timestamp).toLocaleString()}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">${description}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${isDebit ? 'text-red-600' : 'text-green-600'}">${isDebit ? '-' : ''}${formatCurrency(tx.amount)}</td>
                </tr>`;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    };

    const initSettingsPage = () => {
        document.getElementById('profileName').value = state.user.name;
        document.getElementById('profileEmail').value = state.user.email;

        document.getElementById('profileForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const newName = document.getElementById('profileName').value;
            if (newName === state.user.name) return showMessage('Name is unchanged.', false);
            try {
                const result = await apiRequest('/user/profile', 'PUT', { name: newName });
                showMessage(result.message, false);
                state.user.name = newName; // Update state locally
                document.getElementById('userName').textContent = newName;
            } catch (error) {}
        });

        document.getElementById('passwordForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (newPassword !== confirmPassword) return showMessage('New passwords do not match.');
            try {
                const result = await apiRequest('/user/password', 'PUT', { currentPassword, newPassword });
                showMessage(result.message, false);
                e.target.reset();
            } catch (error) {}
        });
    };

    // --- Universal Page Setup (runs on all authenticated pages) ---
    const initAuthenticatedPage = async () => {
        try {
            const data = await apiRequest('/account', 'GET');
            state = { ...state, ...data };
        } catch (error) {
            localStorage.removeItem('authToken');
            window.location.href = 'login.html';
            return;
        }

        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(link => {
            if (link.dataset.page === currentPageName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        document.getElementById('userName').textContent = state.user.name;
        document.getElementById('userEmail').textContent = state.user.email;
        document.getElementById('headerTitle').textContent = currentPageName.charAt(0).toUpperCase() + currentPageName.slice(1);

        document.getElementById('logoutButton').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('authToken');
            window.location.href = 'login.html';
        });

        document.getElementById('menu-toggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('-translate-x-full');
        });

        if (currentPageName === 'dashboard') initDashboardPage();
        if (currentPageName === 'transactions') initTransactionsPage();
        if (currentPageName === 'settings') initSettingsPage();
    };

    // --- Run Initialization ---
    if (currentPageName === 'login') {
        initLoginPage();
    } else {
        initAuthenticatedPage();
    }
});
