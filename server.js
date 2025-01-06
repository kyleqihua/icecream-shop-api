const express = require("express");
const app = express();
const port = 3000;

// Middleware to parse JSON bodies in requests
app.use(express.json());

// Temporary in-memory data to simulate the “flavors” resource
let flavors = [
	{ id: 1, flavor: "strawberry" },
	{ id: 2, flavor: "mint chocolate" },
];

// 1) READ (GET): Retrieve all flavors
//    HTTP method: GET
//    Endpoint: /api/flavors
//    Description: Returns all flavors as JSON
app.get("/api/flavors", (req, res) => {
	res.json(flavors);
});

// 2) CREATE (POST): Add a new flavor
//    HTTP method: POST
//    Endpoint: /api/flavors
//    Description: Create a brand new flavor
app.post("/api/flavors", (req, res) => {
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
app.put("/api/flavors/:id", (req, res) => {
	const flavorId = parseInt(req.params.id, 10);
	const updatedFlavor = req.body.flavor;

	// Find the flavor by ID
	const index = flavors.findIndex((f) => f.id === flavorId);
	if (index === -1) {
		return res.status(404).json({ error: "Flavor not found" });
	}

	// Replace the flavor
	flavors[index].flavor = updatedFlavor;

	// Return the updated flavor
	res.json(flavors[index]);
});

// 4) DELETE: Remove an existing flavor (extra practice)
//    HTTP method: DELETE
//    Endpoint: /api/flavors/:id
app.delete("/api/flavors/:id", (req, res) => {
	const flavorId = parseInt(req.params.id, 10);
	const index = flavors.findIndex((f) => f.id === flavorId);

	if (index === -1) {
		return res.status(404).json({ error: "Flavor not found" });
	}

	// Remove from array
	const deletedFlavor = flavors.splice(index, 1);

	// Return the deleted flavor (or a success message)
	res.json({
		message: "Flavor deleted successfully",
		deleted: deletedFlavor[0],
	});
});

// Start the server
app.listen(port, () => {
	console.log(`Ice Cream Shop REST API running at http://localhost:${port}`);
});
