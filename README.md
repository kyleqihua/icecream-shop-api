Below is a hands-on project-based tutorial inspired directly by the video’s example of a REST API for an ice cream shop. By following these steps, you will learn and practice the core concepts of REST APIs—CRUD operations, endpoints, HTTP methods, JSON responses, and more. This tutorial is written so even newcomers can implement it from scratch. Enjoy!

---

## 1\. Project Overview

We’ll build a small REST API for an ice cream shop that:

- **Lists** current flavors in stock
- **Updates** an existing flavor (e.g., replace “mint chocolate” with “chocolate”)
- **Creates** a brand new flavor (e.g., “restful raspberry”)
- **Deletes** a flavor

We’ll use **Node.js** and **Express** (a common web framework) to keep things simple and focus on REST concepts.

### Folder Structure

```arduino
icecream-shop-api/
├── package.json
├── server.js
└── README.md (optional)
```

---

## 2\. Prerequisites

1. **Node.js and npm**: Install them from [Node.js official website](https://nodejs.org/).
2. **A code editor**: Such as VS Code, Sublime, or any editor you prefer.
3. **A REST client** (optional, but recommended): Tools like [Postman](https://www.postman.com/) or the VS Code REST Client extension to test your new API easily. Alternatively, you can use `curl` from the command line.

---

## 3\. Initialize the Project

1. **Create a new folder** for your project (we’ll call it `icecream-shop-api`).
2. Open your terminal (or command prompt) in the `icecream-shop-api` folder.
3. Initialize an npm project:

```bash
npm init -y
```

This creates a basic `package.json` file. 4. Install Express:

```bash
npm install express
```

---

## 4\. Create the Server File

1. **Create a file** named `server.js` inside `icecream-shop-api`.
2. Open `server.js` in your editor and add the following code:

```js
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies in requests
app.use(express.json());

// Temporary in-memory data to simulate the “flavors” resource
let flavors = [
  { id: 1, flavor: 'strawberry' },
  { id: 2, flavor: 'mint chocolate' }
];

// 1) READ (GET): Retrieve all flavors
//    HTTP method: GET
//    Endpoint: /api/flavors
//    Description: Returns all flavors as JSON
app.get('/api/flavors', (req, res) => {
  res.json(flavors);
});

// 2) CREATE (POST): Add a new flavor
//    HTTP method: POST
//    Endpoint: /api/flavors
//    Description: Create a brand new flavor
app.post('/api/flavors', (req, res) => {
  // Retrieve the flavor from the request body
  const newFlavor = req.body.flavor;

  // Generate a new ID based on current length (simple approach)
  const newId = flavors.length ? flavors[flavors.length - 1].id + 1 : 1;

  // Create the new flavor object
  const createdFlavor = { id: newId, flavor: newFlavor };

  // Add to our in-memory array
  flavors.push(createdFlavor);

  // Return the newly created flavor
  res.json(createdFlavor);
});

// 3) UPDATE (PUT): Update or replace an existing flavor
//    HTTP method: PUT
//    Endpoint: /api/flavors/:id
//    Description: Updates the flavor at a specific ID
app.put('/api/flavors/:id', (req, res) => {
  const flavorId = parseInt(req.params.id, 10);
  const updatedFlavor = req.body.flavor;

  // Find the flavor by ID
  const index = flavors.findIndex((f) => f.id === flavorId);
  if (index === -1) {
    return res.status(404).json({ error: 'Flavor not found' });
  }

  // Replace the flavor
  flavors[index].flavor = updatedFlavor;

  // Return the updated flavor
  res.json(flavors[index]);
});

// 4) DELETE: Remove an existing flavor (extra practice)
//    HTTP method: DELETE
//    Endpoint: /api/flavors/:id
app.delete('/api/flavors/:id', (req, res) => {
  const flavorId = parseInt(req.params.id, 10);
  const index = flavors.findIndex((f) => f.id === flavorId);

  if (index === -1) {
    return res.status(404).json({ error: 'Flavor not found' });
  }

  // Remove from array
  const deletedFlavor = flavors.splice(index, 1);

  // Return the deleted flavor (or a success message)
  res.json({
    message: 'Flavor deleted successfully',
    deleted: deletedFlavor[0]
  });
});

// Start the server
app.listen(port, () => {
  console.log(\`Ice Cream Shop REST API running at http://localhost:${port}\`);
});
```

3. Save the file.

---

## 5\. Run and Test the API

1. **Start the server**:

```bash
node server.js
```

You should see:

```arduino
Ice Cream Shop REST API running at http://localhost:3000
```

2. **Test the endpoints** with a REST client or `curl`.

### a) GET all flavors

- **Method**: GET
- **URL**: http://localhost:3000/api/flavors

**Expected JSON response** (based on our initial `flavors` array):

```json
[
	{
		"id": 1,
		"flavor": "strawberry"
	},
	{
		"id": 2,
		"flavor": "mint chocolate"
	}
]
```

### b) Create a new flavor (POST)

- **Method**: POST
- **URL**: http://localhost:3000/api/flavors
- **Body** (JSON):

```json
{
	"flavor": "restful raspberry"
}
```

**Expected response** (returns the newly created flavor object):

```json
{
	"id": 3,
	"flavor": "restful raspberry"
}
```

### c) Update a flavor (PUT)

Let’s say we want to replace “mint chocolate” (ID=2) with “chocolate”.

- **Method**: PUT
- **URL**: http://localhost:3000/api/flavors/2
- **Body** (JSON):

```json
{
	"flavor": "chocolate"
}
```

**Expected response**:

```json
{
	"id": 2,
	"flavor": "chocolate"
}
```

### d) Delete a flavor (DELETE)

Suppose you want to remove “chocolate” (ID=2).

- **Method**: DELETE
- **URL**: http://localhost:3000/api/flavors/2  
  **Expected response**:

```json
{
	"message": "Flavor deleted successfully",
	"deleted": {
		"id": 2,
		"flavor": "chocolate"
	}
}
```

---

## 6\. Recap and Next Steps

- We used **Express** to build a REST API that handles CRUD:

- **Create** = POST
- **Read** = GET
- **Update** = PUT
- **Delete** = DELETE
- We learned about **endpoints** (e.g., `/api/flavors`) and the **request**/**response** cycle:

1. **Request** includes method (POST, GET, PUT, or DELETE), the endpoint (`/api/flavors`), optional **headers**, and JSON **body** data.
2. **Response** returns JSON data back to the client.

- The in-memory array `flavors` simulates a “database.” In real applications, you’d connect to a true database (e.g., MongoDB, PostgreSQL, etc.).
- **Statelessness**: Notice how each request includes all necessary info (including the flavor ID or flavor data) rather than relying on a session. That is part of what makes REST powerful and scalable.

### Going Further

1. **Authentication & Security**: Explore including API keys or tokens in request headers.
2. **Database Integration**: Replace the in-memory array with a real database (e.g., MongoDB or SQL).
3. **Frontend**: Build a simple web page or single-page application (SPA) that calls your newly created backend REST endpoints.

---

## 7\. Wrap-Up

Congratulations! You’ve built and tested a basic REST API that follows the principles highlighted in the video:

- **REST** = Representational State Transfer
- **Endpoints** define your resources (e.g., `/api/flavors` = “flavors” resource).
- **Methods** map to CRUD operations (POST, GET, PUT, DELETE).
