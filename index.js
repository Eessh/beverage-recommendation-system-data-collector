const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
const port = process.env.PORT || 5000;

// const db = require("./LocalDBQueries.js");
const {
  getTransactions,
  addTransaction,
  clearTransations,
  getMostBoughtBeverage
} = require("./HerokuDBQueries");

app.get("/", (req, res) => {
  res.status(200).json({info: "Server Running"});
});

app.get("/transactions", getTransactions);
app.post("/transactions", addTransaction);
app.delete("/transactions", clearTransations);

app.get("/mostBought", getMostBoughtBeverage);

// app.get("/users", db.getUsers);
// app.get("/users/:id", db.getUserById);
// app.post("/users", db.createUser);
// app.patch("/users/:id", db.updateUser);
// app.delete("/users/:id", db.deleteUser);

// app.get("/beveragesTypes", db.getBeverageTypes);
// app.post("/beveragesTypes", db.createBeverageType);
// app.delete("/beveragesTypes/:id", db.deleteBeverageTypeById);
// app.delete("/beveragesTypes", db.deleteBeverageTypeName);

// app.get("/beverages", db.getBeverages);
// app.get("/beverages/:id", db.getBeverageById);
// app.post("/beverages", db.createBeverage);
// app.delete("/beverages/:id", db.deleteBeverageTypeById);
// app.delete("/beverages", db.deleteBeverageTypeName);

// app.get("/createTransactionsTable", db.createTransactionTable);
// app.get("/transactions", db.getAllTransactions);
// app.post("/transactions", db.addTransaction);

app.listen(port, () => console.log(`Server listening on PORT: ${port}`));
