## Team Reveille - Basic Node MVC Backend

This is a **very basic Node.js "Hello World" backend** using an MVC-style structure.

### Stack

- **Runtime**: Node.js
- **Framework**: Express

### Structure

- `src/server.js` – Starts the HTTP server.
- `src/app.js` – Creates the Express app and wires up middleware and routes.
- `src/routes/index.js` – Defines routes and maps them to controllers.
- `src/controllers/HomeController.js` – Controller that handles the root (`/`) request.
- `src/models/HelloMessage.js` – Minimal model returning the hello-world message string.

### Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the server:

```bash
npm start
# or, for auto-reload during development:
npm run dev
```

3. Open your browser or an API client and hit:

```text
GET http://localhost:3000/
```

You should receive a JSON response:

```json
{ "message": "Hello World from Node MVC!" }
```

