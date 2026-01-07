const API_URL = 'http://localhost:5000/api';

const dashboard = {
    // Helper to get headers
    getHeaders: () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }),

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
            total += d.amount;
            history.innerHTML += `
                <tr>
                    <td>${d.ngoId.name}</td>
                    <td>$${d.amount}</td>
                    <td>${new Date(d.date).toLocaleDateString()}</td>
                </tr>
            `;
        });
        document.getElementById('totalDonated').textContent = `$${total}`;
        document.getElementById('ngosSupported').textContent = new Set(data.data.map(d => d.ngoId._id)).size;
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
            total += d.amount;
            history.innerHTML += `
                <tr>
                    <td>${d.donorId.name}</td>
                    <td>$${d.amount}</td>
                    <td>${new Date(d.date).toLocaleDateString()}</td>
                </tr>
            `;
        });
        document.getElementById('totalReceived').textContent = `$${total}`;
        document.getElementById('donationCount').textContent = data.count;
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
            list.innerHTML += `
                <tr>
                    <td>${d.donorId.name}</td>
                    <td>${d.ngoId.name}</td>
                    <td>$${d.amount}</td>
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
