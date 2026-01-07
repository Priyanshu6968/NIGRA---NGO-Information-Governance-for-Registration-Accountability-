# NIGRA: Run and Test Guide

Follow these steps to get the project running on your local machine.

## 1. Prerequisites
- **Node.js** installed.
- **MongoDB** running locally on `mongodb://localhost:27017/ngo-donation-system` (as configured in `.env`).

## 2. Setup and Run Backend
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd ngo-donation-system/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   - **Main Website Link**: 👉 [http://localhost:5000](http://localhost:5000)

## 3. Run Frontend
The backend now serves the frontend automatically! You can access everything from the link above. Alternatively, you can open files directly:

1. **Main Entry Point**: [index.html](file:///c:/Users/USER/Documents/NIGRA---NGO-Information-Governance-for-Registration-Accountability-/ngo-donation-system/frontend/index.html)
2. **Login Page**: [login.html](file:///c:/Users/USER/Documents/NIGRA---NGO-Information-Governance-for-Registration-Accountability-/ngo-donation-system/frontend/pages/login.html)
3. **Register Page**: [register.html](file:///c:/Users/USER/Documents/NIGRA---NGO-Information-Governance-for-Registration-Accountability-/ngo-donation-system/frontend/pages/register.html)

## 4. Testing the API
You can test the API endpoints using tools like Postman or `curl`.

- **Health Check**: `GET http://localhost:5000/api/auth/test` (if implemented)
- **Auth Routes**: Defined in `src/routes/authRoutes.js`

## 📂 Useful Links
- **Backend Entry**: [server.js](file:///c:/Users/USER/Documents/NIGRA---NGO-Information-Governance-for-Registration-Accountability-/ngo-donation-system/backend/src/server.js)
- **Frontend Entry**: [index.html](file:///c:/Users/USER/Documents/NIGRA---NGO-Information-Governance-for-Registration-Accountability-/ngo-donation-system/frontend/index.html)

## 🛠️ Troubleshooting

### MongoDB Connection Error (`ECONNREFUSED`)
If you see an error like `connect ECONNREFUSED`, it means MongoDB is not running or the connection string is incorrect.

1.  **Check if MongoDB is started**:
    - Open your terminal and run: `mongosh` (if you have MongoDB shell installed).
    - If it's not installed, you can download **MongoDB Community Server**.
2.  **Use a Cloud Database (Alternative)**:
    - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
    - Create a free cluster and get your connection string.
    - Update the `MONGO_URI` in [backend/.env](file:///c:/Users/USER/Documents/NIGRA---NGO-Information-Governance-for-Registration-Accountability-/ngo-donation-system/backend/.env).
3.  **Temporary Testing**:
    - I have updated the code so the server stays up even without MongoDB. You can test the main root page (`http://localhost:5000/`), but login/register features will fail until MongoDB is connected.
