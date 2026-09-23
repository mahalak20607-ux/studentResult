
# Student Result Management System

A web-based **Student Result Management System** developed to manage student academic results efficiently. The system provides a simple interface for adding, viewing, searching, updating, and deleting student results.

## 🚀 Features

- Student result dashboard
- Add student results
- View all results
- Search student results
- Update existing results
- Delete results
- Subject-wise marks
- Automatic total calculation
- Automatic percentage calculation
- Automatic grade calculation
- PASS / FAIL status
- MongoDB database storage
- Responsive and professional UI

## 🛠️ Technologies Used

**Frontend**
- HTML5
- CSS3
- JavaScript
- Bootstrap Icons

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB
- MongoDB Atlas
- Mongoose

## 📁 Project Structure

```text
student-result-management/
│
├── controllers/
├── models/
├── routes/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
````

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/mahalak20607-ux/studentResult.git
cd studentResult
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Add your MongoDB Atlas connection string to `MONGODB_URI`.

### 4. Start the Application

```bash
npm start
```

Open:

```text
http://localhost:5000
```

## 📊 Result Calculation

The system automatically calculates:

* Subject total
* Overall total
* Percentage
* Grade
* Pass / Fail status

### Passing Criteria

```text
Internal ≥ 16 / 40
External ≥ 24 / 60
Total ≥ 40 / 100
```

## 🔗 API Endpoints

| Method | Endpoint                  | Description         |
| ------ | ------------------------- | ------------------- |
| GET    | `/api/results`            | Get all results     |
| GET    | `/api/results/:studentId` | Get student result  |
| POST   | `/api/results`            | Add result          |
| PUT    | `/api/results/:id`        | Update result       |
| DELETE | `/api/results/:id`        | Delete result       |
| GET    | `/api/health`             | Check server status |

## 🔐 Security

Sensitive files are excluded from GitHub using `.gitignore`.

```gitignore
node_modules/
.env
```

The `.env` file should never be uploaded because it contains database credentials.

## 🎯 Objective

The objective of this project is to provide a simple digital solution for managing student academic results and reducing manual result-management work.

## 👩‍💻 Author

**Mahalakshmi S**

GitHub: [mahalak20607-ux](https://github.com/mahalak20607-ux)

## 📄 License

This project is developed for educational and academic purposes.


