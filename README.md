# 🚚 Logistics Fleet & Dispatch Engine API

A production-ready RESTful Backend API built with Node.js, Express, and PostgreSQL. This system manages warehouse dispatch infrastructure, handling strict data validations, relational table dependencies, and automated cloud infrastructure deployments.

Live Service Link: [https://logistics-fleet-dispatch-api.onrender.com](https://logistics-fleet-dispatch-api.onrender.com)

---

## 🚀 Key Features & Architectural Layers

* **Relational Integrity Shield:** Robust table mapping linking `drivers`, `parcels`, and `maintenance_logs` via PostgreSQL foreign key constraints with safe `ON DELETE SET NULL` cascade handling.
* **Automated Schema Versioning:** Programmatic, idempotent migration tracking using `node-pg-migrate`, completely removing manual database configuration drift across environments.
* **Secure Session Architecture:** Stateless user session workflows utilizing `bcryptjs` for cryptographic password hashing and `jsonwebtoken` (JWT) authorization gates.
* **Atomic Database Transactions:** Concurrency mitigation utilizing `BEGIN`, `COMMIT`, and `ROLLBACK` operational queries to guarantee safe cargo handoffs without state mismatch data corruption.
* **Zero-Trust Connection Security:** Environmentally aware connection handlers utilizing ternary logic to toggle encrypted `SSL` handshakes automatically between local machine sandboxes and active live web environments.

---

## ⚙️ Local Development Quickstart

### 1. Installation & Environment Configuration
Clone this repository, run `npm install`, and establish a local `.env` file in the project root:
```text
PORT=3000
NODE_ENV=development
LOCAL_DATABASE_URL=postgres://postgres:<PASSWORD>@localhost:5432/<LOCAL_DATABASE>
DATABASE_URL=postgres://postgres:<PASSWORD>@localhost:5432/<LOCAL_DATABASE>
JWT_SECRET=local_development_only_secret_key_12345
```
### 2. Run Database Migrations & Boot Engine
Programmatically sync your database layout to compile your tables locally before launching:

``` bash
npm run migrate:up
npm start
```
## ☁️ Continuous Deployment Pipeline (Render Network)

This application features an automated production pipeline tied directly to the codebase version control state.

* **Build Hook Strategy:** On every code push, Render executes `npm install` followed instantly by the automated migration command `npm run migrate:up`.
* **Database TLS Enforcement:** The migration runner executes using an explicit `PGSSLMODE=require` state to force a secure, encrypted socket layer handshake with the live database pool before booting the server logic.
* **Dynamic Binding:** Upon migration verification, the application instantiates via `node server.js`, dynamically listening to assigned production environment ports.
