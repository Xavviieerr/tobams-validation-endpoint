const express = require("express");
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Basic GET route
app.get("/", (req, res) => {
	res.send("Hello World from Express!");
});

// Start the server
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
