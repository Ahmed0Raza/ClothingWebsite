# ClothingWebsite

A MERN E-commerce Website for clothing, featuring both backend (API) and frontend (client) code.

---

## Project Structure

```
ClothingWebsite/
├── api/         # Backend (Node.js/Express API)
├── client/      # Frontend (React)
├── README.md
├── .gitignore
└── rundev.sh

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or newer)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Ahmed0Raza/ClothingWebsite.git
cd ClothingWebsite
```

---

### 2. Install Backend Dependencies

```bash
cd api
npm install
```

#### Configure Environment (if required)
- Create a `.env` file in `api/` if your app uses environment variables (e.g., MongoDB URI, JWT secret).

---

### 3. Start Backend Server

```bash
npx nodemon index.js
```
- The backend will typically run at [http://localhost:5000](http://localhost:5000).

---

### 4. Install Frontend Dependencies

Open a new terminal, then:

```bash
cd client
npm install
```

---

### 5. Start Frontend Development Server

```bash
npm run dev
```
- The frontend will typically run at [http://localhost:3000](http://localhost:3000).

---

## Usage

- Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.
- Ensure both frontend (client) and backend (api) servers are running.

---

## Notes

- The `rundev.sh` script may help automate development setup (see its contents for usage).
- Refer to image1 above for the project structure.

---

## License

MIT

---

## Author

**Ahmed Raza**  
[GitHub](https://github.com/Ahmed0Raza)
