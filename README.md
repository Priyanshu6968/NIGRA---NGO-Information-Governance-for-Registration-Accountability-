# NIGRA: NGO Information Governance for Registration & Accountability

A secure, transparent system for NGO registration and donation tracking with role-based access control and Razorpay payment integration.

## 🌐 Live Demo

**[Access Live Application →](https://nigra-ngo-information-governance-for.onrender.com/pages/login.html)**

---

## 📋 Features

### Authentication
- Common login & registration page for all users
- Role-based access control (DONOR, NGO, ADMIN)
- JWT authentication with secure password hashing (bcrypt)

### User/Donor Features
- View verified NGOs and make donations
- Donation history with status tracking (Success/Pending/Failed)
- View personal registration details
- Razorpay payment gateway integration

### NGO Features
- Register NGO profile for admin verification
- Track donations received
- View donor information

### Admin Features
- **Dashboard Statistics**: Total registrations, donors, NGOs, donation amounts
- **NGO Management**: View all NGOs, verify pending registrations
- **User Management**: View all users, filter by role, search functionality
- **Donation Tracking**: View all donations with status and timestamps
- **Export**: Download registration data as CSV

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                        │
│  ┌─────────────┬──────────────┬──────────────┬───────────────┐  │
│  │   Login/    │    Donor     │     NGO      │     Admin     │  │
│  │  Register   │  Dashboard   │  Dashboard   │   Dashboard   │  │
│  └──────┬──────┴──────┬───────┴──────┬───────┴───────┬───────┘  │
└─────────┼─────────────┼──────────────┼───────────────┼──────────┘
          │             │              │               │
          └─────────────┴──────┬───────┴───────────────┘
                               │ HTTP/HTTPS
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                     Middleware                           │    │
│  │    Auth (JWT)  │  Role Check  │  Error Handler           │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                      Routes/Controllers                  │    │
│  │  /auth  │  /ngos  │  /donations  │  /payments            │    │
│  └─────────────────────────────────────────────────────────┘    │
└───────────────────────────────┬─────────────────────────────────┘
                                │
          ┌─────────────────────┴─────────────────────┐
          ▼                                           ▼
┌──────────────────────┐                 ┌──────────────────────┐
│   MongoDB Database   │                 │   Razorpay Gateway   │
│  ┌────────────────┐  │                 │   (Sandbox Mode)     │
│  │  Users         │  │                 └──────────────────────┘
│  │  NGOs          │  │
│  │  Donations     │  │
│  └────────────────┘  │
└──────────────────────┘
```

---

## 💾 Database Schema

### User Collection
| Field | Type | Description |
|-------|------|-------------|
| name | String | User's full name |
| email | String | Unique email address |
| role | Enum | DONOR, NGO, ADMIN |
| password | String | Bcrypt hashed password |
| createdAt | Date | Registration timestamp |

### NGO Collection
| Field | Type | Description |
|-------|------|-------------|
| name | String | NGO name (unique) |
| registrationNumber | String | Official registration number |
| contactInfo | String | Contact details |
| bankOrUPI | String | Payment details |
| isVerified | Boolean | Admin verification status |
| userId | ObjectId | Reference to User |
| createdAt | Date | Registration timestamp |

### Donation Collection
| Field | Type | Description |
|-------|------|-------------|
| donorId | ObjectId | Reference to User (donor) |
| ngoId | ObjectId | Reference to NGO |
| amount | Number | Donation amount (INR) |
| razorpayOrderId | String | Razorpay order ID |
| razorpayPaymentId | String | Razorpay payment ID |
| paymentStatus | Enum | pending, completed, failed |
| date | Date | Transaction timestamp |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Authentication | JWT, Bcrypt |
| Payments | Razorpay (Sandbox) |
| Deployment | Render |

---

## 📦 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/login | User login | Public |
| GET | /api/auth/me | Get current user profile | Private |
| GET | /api/auth/users | Get all users (with filters) | Admin |
| GET | /api/auth/users/export | Export users to CSV | Admin |

### NGOs
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/ngos | Get verified NGOs | Public |
| GET | /api/ngos/all | Get all NGOs | Admin |
| POST | /api/ngos/register | Register NGO | NGO |
| GET | /api/ngos/me | Get my NGO profile | NGO |
| PUT | /api/ngos/verify/:id | Verify NGO | Admin |

### Donations
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/donations | Create donation | Donor |
| GET | /api/donations/my | Get my donations | Donor |
| GET | /api/donations/ngo | Get NGO's donations | NGO |
| GET | /api/donations/all | Get all donations | Admin |
| GET | /api/donations/stats | Get dashboard stats | Admin |

### Payments
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/payments/key | Get Razorpay key | Private |
| POST | /api/payments/create-order | Create payment order | Donor |
| POST | /api/payments/verify | Verify payment | Donor |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v14+
- MongoDB database
- Razorpay account (for sandbox credentials)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Priyanshu6968/NIGRA---NGO-Information-Governance-for-Registration-Accountability-.git
   cd NIGRA---NGO-Information-Governance-for-Registration-Accountability-
   ```

2. **Install dependencies**
   ```bash
   cd ngo-donation-system/backend
   npm install
   ```

3. **Configure environment variables**
   Create `.env` file in backend directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Access the application**
   Open `http://localhost:5000/pages/login.html`

---

## 🔐 Security & Data Handling

- **Registration Independent of Donation**: User data is stored upon registration, regardless of payment outcome
- **Payment Verification**: Donations marked as success only after genuine Razorpay confirmation
- **Failed/Pending Tracking**: All payment attempts are recorded with accurate status
- **No Fake Success**: Payment status relies solely on cryptographic signature verification
- **Password Security**: Bcrypt hashing with salt rounds

---

## 📂 Project Structure

```
ngo-donation-system/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   │   ├── authController.js
│   │   │   ├── donationController.js
│   │   │   ├── ngoController.js
│   │   │   └── paymentController.js
│   │   ├── middleware/     # Auth & role checks
│   │   ├── models/         # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── NGO.js
│   │   │   └── Donation.js
│   │   ├── routes/         # API routes
│   │   ├── config/         # Database config
│   │   └── app.js          # Express app
│   └── package.json
└── frontend/
    ├── css/                # Stylesheets
    ├── js/                 # Client-side logic
    │   ├── auth.js
    │   └── dashboard.js
    └── pages/              # HTML pages
        ├── login.html
        ├── register.html
        ├── donor-dashboard.html
        ├── ngo-dashboard.html
        └── admin-dashboard.html
```

---

## 👤 Admin Access

NGO registration requires admin approval. Admin credentials are managed securely.

- Only administrators can approve/reject NGO registrations
- NGOs must wait for verification before becoming active
- Admin panel provides complete system oversight

---

## 📝 License

MIT License - See [LICENSE](LICENSE) file

---

## 💝 Author

Made with ❤️ by [Priyanshu](https://instagram.com/pryanshunigam)