const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : `${window.location.origin}/api`;

const auth = {
    // Register User
    register: async (userData) => {
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (err) {
            return { success: false, error: 'Server error' };
        }
    },

    // Login User
    login: async (email, password) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                return { success: true, role: data.user.role };
            } else {
                return { success: false, error: data.error };
            }
        } catch (err) {
            return { success: false, error: 'Server error' };
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    },

    // Check auth status
    checkAuth: () => {
        const token = localStorage.getItem('token');
        if (!token) window.location.href = 'login.html';
        return JSON.parse(localStorage.getItem('user'));
    },

    // Redirect based on role
    redirectByRole: (role) => {
        if (role === 'DONOR') window.location.href = 'donor-dashboard.html';
        if (role === 'NGO') window.location.href = 'ngo-dashboard.html';
        if (role === 'ADMIN') window.location.href = 'admin-dashboard.html';
    }
};
