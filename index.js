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
  getBeverages,
  addBeverage,
  removeBeverage,
  
  getTags,
  addTag,
  removeTag,

  getEmotions,
  addEmotion,
  removeEmotion,

  getTransactions,
  getTransactionsIds,
  getTransactionById,
  getFullTransactionById,
  addTransaction,
  getTransactionBeverages,
  getTransactionBeveragesById,
  getTransactionRecommendedBeverages,
  getTransactionRecommendedBeveragesById,

  getMostBoughtBeverage,
  
  createBeveragesTable,
  clearBeveragesTable,
  removeBeveragesTable,
  
  createTagsTable,
  clearTagsTable,
  removeTagsTable,

  createEmotionsTable,
  clearEmotionsTable,
  removeEmotionsTable,

  createTransactionsTable,
  clearTransactionsTable,
  removeTransactionsTable,

  createTransactionBeveragesTable,
  clearTransactionBeveragesTable,
  removeTransactionBeveragesTable,
  test,

  createTransactionRecommendedBeveragesTable,
  clearTransactionRecommendedBeveragesTable,
  removeTransactionRecommendedBeveragesTable
} = require("./HerokuDBQueries");

app.get("/", (req, res) => {
  res.status(200).json({info: "Server Running"});
});

app.get("/beverages", getBeverages);
app.post("/beverages", addBeverage);
app.delete("/beverages", removeBeverage);

app.get("/tags", getTags);
app.post("/tags", addTag);
app.delete("/tags", removeTag);

app.get("/emotions", getEmotions);
app.post("/emotions", addEmotion);
app.delete("/emotions", removeEmotion);

app.get("/transactions/id/full", getFullTransactionById);
app.get("/transactions/id", getTransactionById);
app.get("/transactions/ids", getTransactionsIds);
app.get("/transactions", getTransactions);
app.post("/transactions", addTransaction);

app.get("/transactionbeverages/id", getTransactionBeveragesById);
app.get("/transactionbeverages", getTransactionBeverages);

app.get("/transactionrecommendedbeverages/id", getTransactionRecommendedBeveragesById);
app.get("/transactionrecommendedbeverages", getTransactionRecommendedBeverages);

app.get("/mostBought", getMostBoughtBeverage);

app.post("/beveragesTable", createBeveragesTable);
app.patch("/beveragesTable", clearBeveragesTable);
app.delete("/beveragesTable", removeBeveragesTable);

app.post("/tagsTable", createTagsTable);
app.patch("/tagsTable", clearTagsTable);
app.delete("/tagsTable", removeTagsTable);

app.post("/emotionsTable", createEmotionsTable);
app.patch("/emotionsTable", clearEmotionsTable);
app.delete("/emotionsTable", removeEmotionsTable);

app.post("/transactionsTable", createTransactionsTable);
app.patch("/transactionsTable", clearTransactionsTable);
app.delete("/transactionsTable", removeTransactionsTable);

app.post("/transactionbeveragesTable", createTransactionBeveragesTable);
app.patch("/transactionbeveragesTable", clearTransactionBeveragesTable);
app.delete("/transactionbeveragesTable", removeTransactionBeveragesTable);
app.get("/transactionbeveragesTable", test);

app.post("/transactionrecommendedbeveragesTable", createTransactionRecommendedBeveragesTable);
app.patch("/transactionrecommendedbeveragesTable", clearTransactionRecommendedBeveragesTable);
app.delete("/transactionrecommendedbeveragesTable", removeTransactionRecommendedBeveragesTable);

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
