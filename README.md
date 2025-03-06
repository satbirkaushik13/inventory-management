# 👗 Fashion

A full-stack fashion-related project using **Node.js**, **MySQL**, and **Next.js**, with **Docker** for database management.

---

## 🚀 Tech Stack

- **Backend:** Node.js (Express)
- **Database:** MySQL (with phpMyAdmin)
- **Frontend:** Next.js (React)
- **Containerization:** Docker (for MySQL & phpMyAdmin)
- **Authentication:** JWT (JSON Web Token)

---

## 📁 Project Structure

fashion 
- **backend/** # Node.js backend (Express API)
- **frontend/** # Next.js frontend 
- **docker/** # Docker configuration

---

## ⚙️ Setup Instructions

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/yourusername/fashion.git
cd fashion
docker-compose up -d

2️⃣ Install Dependencies
Backend:
    cd backend
    npm install
    npm run dev
Frontend:
    cd frontend
    npm install
    npm run dev

3️⃣ Setup Environment Variables
Create a .env file inside the backend folder:
DB_HOST=localhost
DB_USER=fashion_user
DB_PASSWORD=fashion_pass
DB_NAME=fashion_db
PORT=5050
JWT_SECRET=XXXXX //Anything as you like
