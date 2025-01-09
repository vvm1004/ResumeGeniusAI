# README: Installation and Running Guide

## Purpose
This document provides a detailed guide on how to set up and run the project, which includes a Python-based backend, a NestJS-based API, and a React.js frontend using Vite.

---

## System Requirements

### General Requirements:
- **Internet Connection**: Required to download necessary libraries and dependencies.

### Backend (Python):
- **Python**: Version 3.11.9 (mandatory).
- **pip**: Python package manager.

### API (NestJS):
- **Node.js**: Version 20x.
- **npm**: Version 10x.

### Frontend (React with Vite):
- **Node.js**: Version 20x.
- **npm or Yarn**: Package managers for JavaScript.

---

## How to Use

### 1. Backend (Python)

#### a. Environment Setup
1. Install Python 3.11.9 from the [Python official website](https://www.python.org/downloads/).
2. Ensure Python is added to the system environment variable `PATH`.
3. Verify the installation:
   ```bash
   python --version
   ```

#### b. Download Required Model Files
1. Access the following link to download the necessary model files: [Download Models](https://drive.google.com/drive/folders/1gGirUGvocg8Mz_2Ja-IVl9GTmEmv6mG1?usp=drive_link).
2. Place these files in the `ai_model/model` directory of the project.

#### c. Create a Virtual Environment (Optional)
To avoid library conflicts:
```bash
python -m venv env
```
Activate the virtual environment:
- **Windows**:
  ```bash
  .\env\Scripts\activate
  ```
- **macOS/Linux**:
  ```bash
  source env/bin/activate
  ```

#### d. Install Dependencies
1. Navigate to the `ai_model` folder containing `requirements.txt`.
2. Run the following command:
   ```bash
   pip install -r requirements.txt
   ```

#### e. Run the Backend
1. Ensure all model files are in the `ai_model` folder.
2. Start the backend:
   ```bash
   python main.py
   ```

---

### 2. API (NestJS)

#### a. Install Node.js and npm
1. Download Node.js from the [Node.js official website](https://nodejs.org/).
2. Verify installation:
   ```bash
   node --version
   npm --version
   ```

#### b. Install Dependencies
1. Navigate to the `backend` folder.
2. Run the following command:
   ```bash
   npm install
   ```

#### c. Configure Environment Variables
1. Create a `.env` file in the `backend` folder with the following content:
   ```env
   PORT=8000
   MONGODB_URI=

   #SET UP ACCESS TOKEN
   JWT_ACCESS_TOKEN_SECRET=
   JWT_ACCESS_EXPIRE=

   JWT_REFRESH_TOKEN_SECRET=
   JWT_REFRESH_EXPIRE=

   #INIT sample data
   SHOULD_INIT=true
   INIT_PASSWORD=

   #CONFIG EMAIL
   EMAIL_HOST=
   EMAIL_AUTH_USER=
   EMAIL_AUTH_PASS=
   EMAIL_PREVIEW=true
   ```

#### d. Run the API
1. Start the NestJS server:
   ```bash
   npm run start:dev
   ```
2. The API will be available at `http://localhost:8000` (default port).

---

### 3. Frontend (React with Vite)

#### a. Install Node.js and npm/Yarn
1. Download Node.js from the [Node.js official website](https://nodejs.org/).
2. Verify installation:
   ```bash
   node --version
   npm --version
   ```

#### b. Install Dependencies
1. Navigate to the `frontend` folder.
2. Run the following command:
   ```bash
   npm install
   ```
   Or, if using Yarn:
   ```bash
   yarn
   ```

#### c. Configure Environment Variables
1. Create a `.env.development` file in the `frontend` folder with the following content:
   ```env
   NODE_ENV=development
   PORT=3000
   VITE_BACKEND_URL=http://localhost:8000
   VITE_EDITOR=0u6zf9prvfgzztp5tw1zm5vwdgx88u7qx51zl51wg5kf49yo
   ```

#### d. Run the Frontend
1. Start the development server:
   ```bash
   npm run dev
   ```
   Or, if using Yarn:
   ```bash
   yarn dev
   ```
2. The application will be available at `http://localhost:3000` (default port).

---

## Notes
1. Ensure you use the specified versions of Python and Node.js to avoid compatibility issues.
2. If you encounter errors during installation, verify your network connection and review the error messages for troubleshooting.
3. Ensure all required files (e.g., model files for the backend) are placed in their correct directories.

---

## Creating a New `requirements.txt` (Backend Only)
To generate a new `requirements.txt` file with your current Python environment:
```bash
pip freeze > requirements.txt
```

