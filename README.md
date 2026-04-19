:::writing{variant=“standard” id=“83921”}

🧱 LEGO Product Admin Tool

An external admin panel for searching LEGO parts and creating products for an online store.

⸻

📌 Description

This project consists of:
	•	Frontend (React + Vite) – product creation interface
	•	Backend (Node.js + Express) – product storage and image upload
	•	Future integration with an existing store (e.g. PrestaShop or custom system)

The tool is designed as a private admin panel and does not modify the public store frontend.

⸻

⚙️ Features

🔍 Search
	•	search LEGO parts by part number
	•	select color variant
	•	auto-filled data:
	•	SKU
	•	price
	•	weight
	•	type

⸻

🛠️ Product Builder
	•	upload multiple images
	•	set main image
	•	edit:
	•	product name
	•	description
	•	price
	•	SEO data
	•	stock
	•	shipping info

⸻

💾 Backend
	•	saves products to products.json
	•	uploads images to /uploads
	•	API endpoints:
	•	GET /api/products
	•	POST /api/products

⸻

🧱 Project Structure

bricklink-app/
├── backend/
│   ├── uploads/
│   ├── data/
│   │   └── products.json
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── styles.css
│   ├── index.html
│   └── package.json

⸻

🚀 Installation

Backend

cd backend
npm install
npm run dev

Backend runs on:
http://localhost:3001

⸻

Frontend

cd frontend
npm install
npm run dev

Frontend runs on:
http://localhost:5173

⸻

🧪 Testing

Manual test
	1.	enter part number (e.g. 44728)
	2.	click Search
	3.	click Create product
	4.	upload images
	5.	click Save
	6.	click Load saved products

⸻

Backend testing (Postman)

GET http://localhost:3001/api/products
POST http://localhost:3001/api/products

⸻

📂 Data Storage

Products

Stored in:
backend/data/products.json

Images

Stored in:
backend/uploads/

⸻

🔐 Architecture

Admin Panel
	•	separate application
	•	only for the store owner
	•	not visible to customers

Store
	•	public website
	•	read-only for users
	•	displays products only

⸻

🔗 Future Integration

Planned features:
	•	integration with real store database
	•	automatic product publishing
	•	API integration (if available)
	•	synchronization with store

⸻

🧪 Automated Testing (Planned)

Backend
	•	Postman collections
	•	API validation
	•	product creation tests

Frontend
	•	Selenium (Python) or Playwright (JS)
	•	full flow testing:
	•	search
	•	create product
	•	upload images
	•	save

⸻

⚠️ Notes
	•	this app is not part of the store frontend
	•	it does not modify the customer UI
	•	it works as a separate admin tool

⸻

👨‍💻 Author

Custom tool for managing LEGO products in an online store.

⸻

🔥 Next Steps
	•	integrate with real store backend
	•	add admin authentication
	•	product editing
	•	product deletion
	•	production deployment
:::
