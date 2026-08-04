# Inventory Management System Server

A legacy Express and MongoDB REST API for pharmacy and non-pharmacy inventory, purchasing, orders, returns, customers, employees, and supplier records.

> **Security warning:** this repository contains a MongoDB connection string with credentials in tracked route files. Assume those credentials are compromised, revoke and rotate them before running the code, remove them from Git history, and replace them with environment variables.

> **Project status:** educational/legacy code. The listed Vercel deployment returned `404 NOT_FOUND` when checked on 4 August 2026.

## What it covers

- Pharmacy and non-pharmacy product CRUD
- Requested-item records
- Orders and purchase records
- Categories, companies, and unit types
- Employees and customers
- Customer, expired, and damaged-item returns
- Supplier documents, lists, and payments
- JSON request handling and permissive CORS

## Tech stack

- Node.js and CommonJS
- Express 4
- MongoDB Node.js driver 4
- dotenv
- Nodemon for local development

## Quick start

### Prerequisites

- A maintained Node.js release compatible with the dependency lockfile
- A MongoDB database
- npm

### Secure the repository first

Do not connect using the credentials committed in `routes/`. Rotate the database user in MongoDB, then refactor every route module to read a single connection URI from an untracked environment file:

```dotenv
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<database>
PORT=5000
```

The current code does not yet consume `MONGODB_URI`; that refactor is required before safe use.

### Install and run

```bash
git clone https://github.com/montasim/inventory-management-system-server.git
cd inventory-management-system-server
npm install
npm run dev
```

For a non-watching process, use `npm start`. The server defaults to `http://localhost:5000`.

## API map

The application mounts resource routers under these prefixes:

| Resource | Prefix |
| --- | --- |
| Pharmacy products | `/api/products/pharmacy` |
| Non-pharmacy products | `/api/products/nonPharmacy` |
| Requested items | `/api/requestedItems/pharmacy`, `/api/requestedItems/nonPharmacy` |
| Orders | `/api/orders/pharmacy`, `/api/orders/nonPharmacy` |
| Purchases | `/api/purchases/pharmacy`, `/api/purchases/nonPharmacy` |
| Setup | `/api/setup/categories`, `/api/setup/companies`, `/api/setup/unitTypes` |
| People | `/api/employees`, `/api/customers` |
| Returns | `/api/returns/customers`, `/api/returns/expiresOrDamagesReturns` |
| Suppliers | `/api/suppliers/documents`, `/api/suppliers/lists`, `/api/suppliers/payments` |

Most resource routers expose collection reads and creates at `/` and item reads, updates, and deletes at `/:id`. Inspect the corresponding module under [routes/api](routes/api) for the exact payload and behavior.

## Project structure

```text
.
├── index.js                  # Express entry point and route mounting
├── routes/api/              # Resource-specific MongoDB routers
├── package.json
└── node_modules/            # Legacy committed dependency tree
```

## Important limitations

- Database credentials are exposed in source and require immediate rotation.
- `node_modules` is committed. A future maintenance change should remove it from version control and rely on `package-lock.json`.
- No authentication or authorization middleware protects the data-changing endpoints.
- CORS is unrestricted.
- There are no automated tests, API schema, CI workflow, or documented validation rules.
- Several routers open independent MongoDB clients and do not close them.
- The purchase mounts in `index.js` currently import the order routers rather than the purchase routers.
- The repository has no root license file; `"license": "ISC"` in package metadata alone does not provide the full license text.

This code is useful as a learning artifact, but it should not be exposed to production traffic without a security and data-model review.

## Verification

After starting the service:

```bash
curl http://localhost:5000/
curl http://localhost:5000/api/setup/categories
```

The first request should return the server welcome message. Resource responses depend on your database.

## Contributing and security

Open an issue before making substantial changes. For the exposed credential, contact the maintainer privately rather than posting replacement secrets in an issue.

## Support

Use [GitHub Issues](https://github.com/montasim/inventory-management-system-server/issues) for reproducible bugs or documentation gaps. You can also [support the maintainer on SupportKori](https://www.supportkori.com/montasim).

## License status

No root license file is present. Until the maintainer adds an explicit license, copyright law reserves reuse rights despite the package metadata mentioning ISC.
