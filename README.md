# Logistics Fleet & Dispatch Engine API

A production-ready RESTful Backend API built with Node.js, Express, and PostgreSQL. This system manages an e-commerce or logistics warehouse dispatch infrastructure, handling relational table dependencies, strict database data integrity validations, automated tracking tokens, and atomic transactions.

## 🚀 Key Features & Architectural Layers

- **Express MVC Architecture**: Clean separation of concerns across structural layout boundaries (`app.js` entry point, `routes/`, `controllers/`, and decoupled `models/` execution scripts).
- **Relational Integrity Shield**: Robust table mapping linking `drivers` and `parcels` via PostgreSQL foreign key constraints with safe `ON DELETE SET NULL` cascade handling.
- **Atomic Database Transactions**: Concurrency mitigation utilizing `BEGIN`, `COMMIT`, and `ROLLBACK` operational queries to guarantee safe cargo handoffs without state mismatch data corruption.
- **Automated Alphanumeric Token Generation**: Cryptographically non-colliding tracking code generator using Node.js native `crypto` modules (`TRK-[YEAR]-[HEX]`) to safely isolate parameter parsing.
- **Centralized Global Error Catching**: Unified Express async pipeline middleware utilizing four-parameter `(err, req, res, next)` interceptors for cleaner code structure.
- **Zero-Trust Connection Security**: Environmentally aware multi-stage connection handlers utilizing ternary logic operators to toggle encrypted `SSL` handshakes automatically between `localhost` sandbox tests and external live web environments.

---

## 📁 System Repository Structure

```text
logistics_engine/
├── config/
│   └── db.js                 # PostgreSQL Pool connection instance config
├── controllers/
│   ├── driverController.js   # Request parsing, validations, and endpoint route orchestration
│   ├── maintenanceController.js
│   └── parcelController.js
├── middleware/
│   └── errorHandler.js       # Centralized 4-argument global error catcher response gate
├── models/
│   ├── driverModel.js        # Pure data storage access queries and transaction scripts
│   ├── maintenanceModel.js
│   └── parcelModel.js
├── routes/
│   ├── driverRoutes.js       # Express Traffic Cop routing paths
│   ├── maintenanceRoutes.js
│   └── parcelRoutes.js
├── .env                      # Hidden system environment constants (Git-shielded)
├── .gitignore                # Production security exclusions
├── app.js                    # Global application server bootstrapping file
└── package.json

```

---

## 🛠️ Database Schema Blueprint

```sql
-- 1. DRIVERS TABLE
CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Available' CHECK (status IN ('Available', 'On Delivery', 'Suspended'))
);

-- 2. PARCELS TABLE
CREATE TABLE parcels (
    id SERIAL PRIMARY KEY,
    tracking_number VARCHAR(100) UNIQUE NOT NULL,
    destination VARCHAR(255) NOT NULL,
    weight_kg NUMERIC(6, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Dispatched', 'Delivered')),
    driver_id INT REFERENCES drivers(id) ON DELETE SET NULL
);

-- 3. MAINTENANCE LOGS TABLE
CREATE TABLE maintenance_logs (
    id SERIAL PRIMARY KEY,
    ticket_number VARCHAR(100) UNIQUE NOT NULL,
    vehicle_type VARCHAR(100) NOT NULL,
    scheduled_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Overdue')),
    driver_id INT REFERENCES drivers(id) ON DELETE SET NULL
);

```

---

## 🛰️ Core API Operational Endpoints

### 🚚 Driver Logistics Management

* **`POST /drivers`**: Onboards a new driver. Validates parameter inputs and handles unique license number conflicts gracefully.
* **`GET /drivers/active-manifest`**: Runs advanced relational database queries utilizing a `LEFT JOIN` and an optimized inline SQL `array_agg() FILTER` aggregation framework to list active drivers alongside compiling their assigned parcel tracking manifests.

### 📦 Parcel Shipping Infrastructure

* **`POST /parcels`**: Registers an incoming shipment. Automatically fires internal crypto engines to generate tracking codes natively, ignoring user input injection vectors.
* **`PUT /parcels/:id/dispatch`**: Assigns a vehicle package. Validates state constraints to block shipments if a package is already dispatched or if the target operator is flagged as suspended or away.

### 🔄 Administrative Control Systems

* **`PUT /drivers/transfer-cargo`**: Triggers a secure transaction. Shifts all active delivery tracking pointers from Driver A to Driver B atomically inside a rollback sandbox, safely returning both trucks to their accurate operational states.
* **`POST /maintenance`**: Automatically logs and books scheduling intervals with date boundary validation layers.

---

## ⚙️ Local Development Quickstart

### 1. Installation

Clone your repository and run the installation script:

```bash
npm install

```

### 2. Configuration (`.env`)

Create a local `.env` hidden parameter root file and populate it with your cloud connection strings:

```text
PORT=3000
DATABASE_URL=postgres://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE_NAME>

```

### 3. Running Execution Engine

```bash
node app.js

```