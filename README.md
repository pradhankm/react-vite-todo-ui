# react-vite-todo-ui

A small React (Vite) UI that can run:
- **Standalone** (localStorage mode), or
- **Connected** to the Spring Boot API (`springboot-todo-api`)

## Prerequisites
- Node.js 18+

## Install & run
```bash
cd react-vite-todo-ui
npm install
npm run dev
```

Open:
- http://localhost:5173

## Connect to the API (recommended)
Start the API first:
```bash
# in another terminal
cd ../springboot-todo-api
mvn spring-boot:run
```

Then run the UI with:
```bash
# mac/linux
VITE_API_BASE_URL=http://localhost:8080 npm run dev

# windows (powershell)
$env:VITE_API_BASE_URL="http://localhost:8080"; npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Notes
- If `VITE_API_BASE_URL` is not set, the app uses localStorage.
- Great place to add: auth, pagination, filters, UI tests (Playwright/Cypress).
