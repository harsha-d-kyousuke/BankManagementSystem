# 🏦 Online Banking Management System (No Backend Required)

An enterprise-grade online banking platform designed to demonstrate a complete digital banking experience entirely within the browser. The system showcases secure customer banking features, real-time analytics, and advanced administrative tools. Fully compatible with Vercel for seamless deployment.

---

## ✨ Key Features

### 👤 Customer Banking Module
- **Secure Authentication** for customer and admin roles
- **Personal Dashboard**
  - Current balance
  - Account number
  - Account status (Active / Frozen)
- **Core Banking Operations**
  - ✅ Deposit funds
  - ✅ Withdraw funds with insufficient balance protection
  - ✅ Inter-account transfers via account number
- **Transaction History**
  - Chronological log of all activity
  - Sortable and filterable UI

---

### 📊 Financial Analytics Suite
Interactive, dynamic charts powered by **Chart.js**:
- 📈 Balance Trend (Line Chart)
- 📊 Monthly deposits vs. withdrawals (Bar Chart)
- 🥧 Transaction type distribution (Pie Chart)
- 🍩 Cash flow breakdown (Doughnut Chart)

All charts update automatically based on transaction data.

---

### 🔐 Admin Panel & Privileges
A fully separate management interface:
- View and search all users
- Freeze or reactivate accounts
- View transaction history per user
- Adjust balances with secure audit entries

---

## 🧩 Technology Stack

| Layer | Tech |
|-------|------|
| UI Framework | React 18 + TypeScript |
| Styling | Tailwind CSS |
| Visualization | Chart.js + react-chartjs-2 |
| Data Handling | React Hooks (useState, useEffect, useContext) |
| Build | Client-side only, zero backend |
| Deployment | ✅ Vercel-Ready |

No Firebase or external database required. All data stored locally for demonstration purposes.

---

## 🚀 Getting Started

### ✅ Local Setup
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>

Open in VS Code and launch using:

    Vite

npm install
npm run dev

or

    Live Server Extension (open index.html)

The app will run in your browser automatically.
🔑 Sample Login Credentials
Role	Email	Password
Customer	customer@bankpro.com
password123
Admin	admin@bankpro.com
adminpass
☁️ Deployment to Vercel

    Push this repository to GitHub

    Open Vercel Dashboard

    Select New Project

    Choose this repo

    Deploy with default settings

The app is instantly live on a secure domain.
🗂️ Project Structure

src/
 ├─ components/
 ├─ context/
 ├─ pages/
 ├─ charts/
 ├─ styles/
 └─ utils/
public/
index.html
package.json
README.md

📌 Roadmap

Upcoming enhancements:

    Multi-currency support

    Loan and credit modules

    Biometric authentication (WebAuthn)

    Progressive Web App support (offline banking demo)

🙌 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss proposals.
📜 License

This project is licensed under the MIT License. Free to use, modify, and deploy.
👨‍💻 Made for learning, finance labs, and portfolio projects.

Build. Learn. Deploy. 🚀


---

### If you want, I can also:
✅ Generate a project logo  
✅ Add preview screenshots to README  
✅ Write full commit history guidelines  
✅ Provide Vercel environment config if needed

Would you like me to push this README format directly into your project and customize it with your GitHub username and repo name?


ChatGPT can make mistakes. Check important info. See Cookie Preferences.
