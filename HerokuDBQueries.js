const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

/**
 * Heroku way of connecting to database
 */
client
.connect()
.then(() => {
  console.log("Log: Database URL: ", process.env.DATABASE_URL);
  console.log("Log: Connected to database :)");
})
.catch((err) => {
  console.log("Log: Database URL: ", process.env.DATABASE_URL);
  console.log("Log: Error while connecting to database: ", err)
});

const getTransactions = (req, res) => {
  client.query("SELECT * FROM transactions", [], (err, results) => {
    if (err) {
      console.log("Log: Error occurred while getting all transactions: ", err)
      // returning a server error
      res.status(500).json({info: "Error occurred while getting all transactions"});
      return;
    }
    console.log("Log: transactions: ", results.rows);
    res.status(200).json({transactions: results.rows});
  });
};

const addTransaction = (req, res) => {
  const transactionData = req.body.data;
  if (transactionData===undefined || transactionData===null) {
    // returning a client error
    res.status(400).json({info: "Request should contain data field in body, about transaction"});
    return;
  }

  const constructArrayStr = (arr) => {
    let str = "{";
    arr.forEach((beverage) => {
      str += '"' + beverage + '",';
    });
    str = str.slice(0, -1);
    str += "}";
    console.log("Log: Constructed Array: ", str);
    return str;
  };

  client.query("INSERT INTO transactions (season, gender, age, emotion, weather, temperature, beverages) VALUES ($1, $2, $3, $4, $5, $6, $7)", [
    transactionData.season,
    transactionData.gender,
    parseInt(transactionData.age),
    transactionData.emotion,
    transactionData.weather,
    parseInt(transactionData.temperature),
    constructArrayStr(transactionData.beverages)
  ], (err, results) => {
    if (err) {
      console.log("Log: Error occurred while inserting a transaction: ", err);
      // returning a server error
      res.status(500).json({info: "Error occurred while inserting a transaction"});
      return;
    }
    console.log("Log: transaction added");
    res.status(200).json({info: "Transaction added"});
  });
};

const clearTransations = (req, res) => {
  client.query("TRUNCATE transactions", [], (err, results) => {
    if (err) {
      console.log("Log: Error while clearing transactions: ", err);
      // returning a server error
      res.status(500).json({info: "Error while clearing transactions"});
      return;
    }
    console.log("Log: transactions cleared");
    res.status(200).json({info: "Transactions cleared"});
  });
};

const getMostBoughtBeverage = (req, res) => {
  client.query("SELECT * FROM transactions", [], (err, results) => {
    if (err) {
      console.log("Log: Error occurred while getting all transactions: ", err)
      // returning a server error
      res.status(500).json({info: "Error occurred while getting all transactions"});
      return;
    }
    const beveragesMap = new Map();
    results.rows.forEach((row) => {
      row.beverages.forEach((beverage) => {
        if (beveragesMap.has(beverage)) {
          const count = beveragesMap.get(beverage);
          beveragesMap.set(beverage, count+1);
        }
        else {
          beveragesMap.set(beverage, 1);
        }
      });
    });
    let mostBought = null, maxCount = 0;
    beveragesMap.forEach((value, key) => {
      if (value > maxCount) {
        maxCount = value;
        mostBought = key;
      }
    });
    res.status(200).json({mostBought: mostBought});
  });
};

module.exports = {
  getTransactions,
  addTransaction,
  clearTransations,
  getMostBoughtBeverage
};