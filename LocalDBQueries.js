const Pool = require("pg").Pool;

const pool = new Pool({
  user: "me",
  hostname: "localhost",
  database: "api",
  password: "bujji",
  port: 5432
});

const getUsers = (req, res) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (err, results) => {
    if (err) throw err;
    res.status(200).json(results.rows);
  });
};
const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query('SELECT name, email FROM users WHERE id = $1', [id], (err, results) => {
    if (err) throw err;
    res.status(200).json(results.rows);
  });
};

const createUser = (req, res) => {
  const {username, email} = req.body;
  pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [username, email], (err, results) => {
    if (err) throw err;
    console.log("Log: Inserted User: {", ",", username, ",", email, "}");
    res.status(200).json({info: results});
  });
};

const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const {username, email} = req.body;
  pool.query('UPDATE users SET name=$1, email=$2 WHERE id=$3', [username, email, id], (err, results) => {
    if (err) throw err;
    res.send(200).json({info: `User modified`});
  });
};

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query('DELETE FROM users WHERE id=$1', [id], (err, results) => {
    if (err) throw err;
    res.status(200).json({info: `User deleted`});
  });
};

const getBeverageTypes = (req, res) => {
  pool.query("SELECT * FROM BeverageTypes", (err, results) => {
    if (err) throw err;
    res.status(200).json({beverageTypes: results.rows});
  });
};

const createBeverageType = (req, res) => {
  const beverageType = req.body.beverageType;
  pool.query("INSERT INTO BeverageTypes (name) VALUES ($1)", [beverageType], (err, results) => {
    if (err) throw err;
    res.status(200).json({info: "BeverageType created"});
  });
};

const deleteBeverageTypeById = (req, res) => {
  const id = req.params.id;
  pool.query("DELETE FROM BeverageTypes WHERE id=$1", [id], (err, results) => {
    if (err) throw err;
    res.status(200).json({info: "Deleted Beverage type"});
  });
};
const deleteBeverageTypeName = (req, res) => {
  const beverageTypeName = req.body.name;
  pool.query("DELETE FROM BeverageTypes WHERE name=$1", [beverageTypeName], (err, results) => {
    if (err) throw err;
    res.status(200).json({info: "Deleted Beverage type"});
  });
};

const getBeverages = (req, res) => {
  pool.query("SELECT * FROM Beverages", (err, results) => {
    if (err) throw err;
    res.status(200).json({beverages: results.rows});
  });
};

const createBeverage = (req, res) => {
  const beverage = req.body;
  pool.query("INSERT INTO Beverages (type, name, price, description, quantity) VALUES ($1, $2, $3, $4, $5)", [
    beverage.type,
    beverage.name,
    beverage.price,
    beverage.description,
    beverage.quantity
  ], (err, results) => {
    if (err) throw err;
    res.status(200).json({info: "Beverage created"});
  });
};

const getBeverageById = (req, res) => {
  const id = req.params.id;
  pool.query("SELECT * FROM Beverages WHERE id=$1", [id], (err, results) => {
    if (err) throw err;
    res.status(200).json({beverage: results.rows[0]});
  });
};

const deleteBeverageById = (req, res) => {
  const id = req.params.id;
  pool.query("DELETE FROM Beverages WHERE id=$1", [id], (err, results) => {
    if (err) throw err;
    res.status(200).json({info: "Beverage deleted"});
  });
};

const deleteBeverageByName = (req, res) => {
  const beverageName = req.body.name;
  pool.query("DELETE FROM Beverages WHERE name=$1", [beverageName], (err, results) => {
    if (err) throw err;
    res.status(200).json({info: "Beverage deleted"});
  });
};

const addTransaction = (req, res) => {
  const transactionData = req.body.data;

  const constructArrayStr = (arr) => {
    let str = "{";
    arr.forEach((beverage) => {
      str += '"' + beverage + '",';
    });
    str = str.slice(0, -1);
    str += "}";
    console.log("Log: Constructed Array: ", str);
    return str
  };

  pool.query("INSERT INTO transactions (season, gender, age, emotion, weather, temperature, beverages) VALUES ($1, $2, $3, $4, $5, $6, $7)", [
    transactionData.season,
    transactionData.gender,
    parseInt(transactionData.age),
    transactionData.emotion,
    transactionData.weather,
    parseInt(transactionData.temperature),
    constructArrayStr(transactionData.beverages)
  ], (err, results) => {
    if (err) throw err;
    res.status(200).json({info: "Transaction added"});
  });
};

const getAllTransactions = (req, res) => {
  pool.query("SELECT * FROM transactions", [], (err, results) => {
    if (err) throw err;
    res.status(200).json({transactions: results.rows});
  });
};

const createTransactionTable = (req, res) => {
  pool.query("CREATE TABLE transactions (id SERIAL PRIMARY KEY NOT NULL, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, season VARCHAR(20), gender VARCHAR(10), age INT, emotion VARCHAR(10), weather VARCHAR(10), temperature FLOAT(1), beverages TEXT []);", [], (err, results) => {
    if (err) throw err;
    res.status(200).json({info: "Created Transactions table"});
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getBeverageTypes,
  createBeverageType,
  deleteBeverageTypeById,
  deleteBeverageTypeName,
  getBeverages,
  getBeverageById,
  createBeverage,
  deleteBeverageTypeById,
  deleteBeverageTypeName,
  createTransactionTable,
  getAllTransactions,
  addTransaction
};
