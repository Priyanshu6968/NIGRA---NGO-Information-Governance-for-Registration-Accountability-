const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : `${window.location.origin}/api`;

const dashboard = {
    // Helper to get headers
    getHeaders: () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }),

    // --- Razorpay Payment Functions ---
    getPaymentKey: async () => {
        const res = await fetch(`${API_URL}/payments/key`, { headers: dashboard.getHeaders() });
        return await res.json();
    },

    createPaymentOrder: async (ngoId, amount) => {
        const res = await fetch(`${API_URL}/payments/create-order`, {
            method: 'POST',
            headers: dashboard.getHeaders(),
            body: JSON.stringify({ ngoId, amount })
        });
        return await res.json();
    },

    verifyPayment: async (paymentData) => {
        const res = await fetch(`${API_URL}/payments/verify`, {
            method: 'POST',
            headers: dashboard.getHeaders(),
            body: JSON.stringify(paymentData)
        });
        return await res.json();
    },

    // --- Donor Actions ---
    loadVerifiedNGOs: async () => {
        const res = await fetch(`${API_URL}/ngos`, { headers: dashboard.getHeaders() });
        const data = await res.json();
        const list = document.getElementById('ngoList');
        list.innerHTML = '';

        data.data.forEach(ngo => {
            list.innerHTML += `
                <div class="ngo-card">
                    <div>
                        <strong>${ngo.name}</strong><br>
                        <small style="color: var(--text-muted)">${ngo.contactInfo}</small>
                    </div>
                    <button class="btn btn-primary" style="padding: 0.5rem 1rem;" onclick="openDonationModal('${ngo._id}', '${ngo.name}')">Donate</button>
                </div>
            `;
        });
        document.getElementById('ngosSupported').textContent = new Set(JSON.parse(localStorage.getItem('myDonations') || '[]').map(d => d.ngoId._id)).size;
    },

    loadMyDonations: async () => {
        const res = await fetch(`${API_URL}/donations/my`, { headers: dashboard.getHeaders() });
        const data = await res.json();
        localStorage.setItem('myDonations', JSON.stringify(data.data));

        const history = document.getElementById('donationHistory');
        history.innerHTML = '';
        let total = 0;

        data.data.forEach(d => {
            // Only count completed donations in total
            if (d.paymentStatus === 'completed' || !d.paymentStatus) {
                total += d.amount;
            }
            const statusClass = d.paymentStatus === 'completed' ? 'status-completed' :
                d.paymentStatus === 'failed' ? 'status-failed' : 'status-pending';
            const statusText = d.paymentStatus ? d.paymentStatus.charAt(0).toUpperCase() + d.paymentStatus.slice(1) : 'Completed';

            history.innerHTML += `
                <tr>
                    <td>${d.ngoId.name}</td>
                    <td>₹${d.amount}</td>
                    <td><span class="payment-status ${statusClass}">${statusText}</span></td>
                    <td>${new Date(d.date).toLocaleDateString()}</td>
                </tr>
            `;
        });
        document.getElementById('totalDonated').textContent = `₹${total}`;
        document.getElementById('ngosSupported').textContent = new Set(data.data.filter(d => d.paymentStatus === 'completed' || !d.paymentStatus).map(d => d.ngoId._id)).size;
    },

    makeDonation: async (ngoId, amount) => {
        const res = await fetch(`${API_URL}/donations`, {
            method: 'POST',
            headers: dashboard.getHeaders(),
            body: JSON.stringify({ ngoId, amount })
        });
        return res.ok;
    },

    // --- NGO Actions ---
    getMyNGOProfile: async () => {
        const res = await fetch(`${API_URL}/ngos/me`, { headers: dashboard.getHeaders() });
        const data = await res.json();
        return data.success ? data.data : null;
    },

    registerNGO: async (ngoData) => {
        const res = await fetch(`${API_URL}/ngos/register`, {
            method: 'POST',
            headers: dashboard.getHeaders(),
            body: JSON.stringify(ngoData)
        });
        return res.ok;
    },

    loadNGODonations: async () => {
        const res = await fetch(`${API_URL}/donations/ngo`, { headers: dashboard.getHeaders() });
        const data = await res.json();
        const history = document.getElementById('ngoDonations');
        history.innerHTML = '';
        let total = 0;

        data.data.forEach(d => {
            // Only count completed donations
            if (d.paymentStatus === 'completed' || !d.paymentStatus) {
                total += d.amount;
            }
            history.innerHTML += `
                <tr>
                    <td>${d.donorId.name}</td>
                    <td>₹${d.amount}</td>
                    <td>${new Date(d.date).toLocaleDateString()}</td>
                </tr>
            `;
        });
        document.getElementById('totalReceived').textContent = `₹${total}`;
        document.getElementById('donationCount').textContent = data.data.filter(d => d.paymentStatus === 'completed' || !d.paymentStatus).length;
    },

    // --- Admin Actions ---
    loadAllNGOsForAdmin: async () => {
        const res = await fetch(`${API_URL}/ngos/all`, { headers: dashboard.getHeaders() });
        const data = await res.json();
        const list = document.getElementById('adminNGOList');
        list.innerHTML = '';

        data.data.forEach(ngo => {
            const statusClass = ngo.isVerified ? 'status-verified' : 'status-pending';
            const actionBtn = ngo.isVerified ? '' :
                `<button class="btn btn-primary" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;" onclick="dashboard.verifyNGO('${ngo._id}')">Verify</button>`;

            list.innerHTML += `
                <tr>
                    <td>${ngo.name}</td>
                    <td>${ngo.registrationNumber}</td>
                    <td>${ngo.contactInfo}</td>
                    <td><span class="status-badge ${statusClass}">${ngo.isVerified ? 'Verified' : 'Pending'}</span></td>
                    <td>${actionBtn}</td>
                </tr>
            `;
        });
    },

    verifyNGO: async (id) => {
        if (!confirm('Are you sure you want to verify this NGO?')) return;
        const res = await fetch(`${API_URL}/ngos/verify/${id}`, {
            method: 'PUT',
            headers: dashboard.getHeaders()
        });
        if (res.ok) {
            dashboard.loadAllNGOsForAdmin();
        }
    },

    loadAllDonationsForAdmin: async () => {
        const res = await fetch(`${API_URL}/donations/all`, { headers: dashboard.getHeaders() });
        const data = await res.json();
        const list = document.getElementById('adminDonationList');
        list.innerHTML = '';
        data.data.forEach(d => {
            const statusClass = d.paymentStatus === 'completed' ? 'status-completed' :
                d.paymentStatus === 'failed' ? 'status-failed' : 'status-pending';
            const statusText = d.paymentStatus ? d.paymentStatus.charAt(0).toUpperCase() + d.paymentStatus.slice(1) : 'Completed';

            list.innerHTML += `
                <tr>
                    <td>${d.donorId.name}</td>
                    <td>${d.ngoId.name}</td>
                    <td>₹${d.amount}</td>
                    <td><span class="payment-status ${statusClass}">${statusText}</span></td>
                    <td>${new Date(d.date).toLocaleDateString()}</td>
                </tr>
            `;
        });
    }
};

// Global helpers for HTML onclicks
window.openDonationModal = (id, name) => {
    document.getElementById('modalNGOId').value = id;
    document.getElementById('modalNGOName').textContent = `Donate to ${name}`;
    document.getElementById('donationModal').style.display = 'flex';
};

