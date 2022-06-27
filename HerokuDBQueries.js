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




// ----------- Beverages
const getBeverages = (req, res) => {
  client.query(`
    SELECT * FROM beverages
  `, [], (err, results) => {
    if (err) {
      console.log("Log: Error occurred while getting all beverages: ", err);
      // returning server error
      res.status(500).json({info: "Error occurred while getting all beverages"});
      return;
    }
    console.log("Log: beverages: ", results.rows);
    res.status(200).json({beverages: results.rows});
  });
};

const addBeverage = (req, res) => {
  const beverage = req.body.beverage;
  if (beverage===undefined || beverage===null) {
    // returning a client error
    res.status(400).json({info: "Request should contain beverage field in body!!!"});
    return;
  }
  
  client.query(`
    INSERT INTO beverages (name) VALUES ($1)
  `, [beverage], (err, results) => {
    if (err) {
      console.log(`Log: Error while inserting beverage: ${beverage}, Erorr: `, err);
      // returning server error
      res.status(500).json({info: `Error while inserting beverage: ${beverage}`});
      return;
    }
    console.log(`Log: Added beverage: ${beverage} into beverages table.`);
    res.status(200).json({info: `Added beverage: ${beverage} into beverages table.`})
  });
};

const removeBeverage = (req, res) => {
  const beverage = req.body.beverage;
  if (beverage===undefined || beverage===null) {
    // returning a client error
    res.status(400).json({info: "Request should contain beverage field in body!!!"});
    return;
  }

  client.query(`
    DELETE FROM beverages
    WHERE name=$1
  `, [beverage], (err, results) => {
    if (err) {
      console.log(`Log: Error while deleting beverage: ${beverage}, Error: `, err);
      // returning server error
      res.status(500).json({info: `Error while deleting beverage: ${beverage}`});
      return;
    }
    console.log(`Log: Deleted beverage: ${beverage} from beverages table.`);
    res.status(200).json({info: `Deleted beverage: ${beverage} from beverages table.`});
  });
};




// ----------- Tags
const getTags = (req, res) => {
  client.query(`
    SELECT * FROM tags
  `, [], (err, results) => {
    if (err) {
      console.log("Log: Error occurred while getting all tags: ", err);
      // returning server error
      res.status(500).json({info: "Error occurred while getting all tags"});
      return;
    }
    console.log("Log: tags: ", results.rows);
    res.status(200).json({tags: results.rows});
  });
};

const addTag = (req, res) => {
  const tag = req.body.tag;
  if (tag===undefined || tag===null) {
    // returning a client error
    res.status(400).json({info: "Request should contain tag field in body!!!"});
    return;
  }
  
  client.query(`
    INSERT INTO tags (name) VALUES ($1)
  `, [tag], (err, results) => {
    if (err) {
      console.log(`Log: Error while inserting tag: ${tag}, Erorr: `, err);
      // returning server error
      res.status(500).json({info: `Error while inserting tag: ${tag}`});
      return;
    }
    console.log(`Log: Added tag: ${tag} into tags table.`);
    res.status(200).json({info: `Added tag: ${tag} into tags table.`})
  });
};

const removeTag = (req, res) => {
  const tag = req.body.tag;
  if (tag===undefined || tag===null) {
    // returning a client error
    res.status(400).json({info: "Request should contain tag field in body!!!"});
    return;
  }

  client.query(`
    DELETE FROM beverages
    WHERE name=$1
  `, [tag], (err, results) => {
    if (err) {
      console.log(`Log: Error while deleting tag: ${tag}, Error: `, err);
      // returning server error
      res.status(500).json({info: `Error while deleting tag: ${tag}`});
      return;
    }
    console.log(`Log: Deleted tag: ${tag} from tags table.`);
    res.status(200).json({info: `Deleted tag: ${tag} from tags table.`});
  });
};




// ----------- Emotions
const getEmotions = (req, res) => {
  client.query(`
    SELECT * FROM emotions
  `, [], (err, results) => {
    if (err) {
      console.log(`Log: Error while getting all emotions: `, err);
      // returning server error
      res.status(500).json({info: `Error while getting all emotions.`});
    }
    console.log("Log: emotions: ", results.rows);
    res.status(200).json({emotions: results.rows});
  });
};

const addEmotion = (req, res) => {
  const emotion = req.body.emotion;
  if (emotion===undefined || emotion===null) {
    // returning a client error
    res.status(400).json({info: "Request should contain emotion field in body!!!"});
    return;
}
  
  client.query(`
    INSERT INTO emotions (name) VALUES ($1)
  `, [emotion], (err, results) => {
    if (err) {
      console.log(`Log: Error while inserting emotion: ${emotion}, Error: `, err);
      // returning server error
      res.status(500).json({info: `Error while inserting emotion: ${emotion}.`});
    }
    console.log(`Log: Added emotion: ${emotion} into emotions table.`);
    res.status(200).json({info: `Added emotion: ${emotion} into emotions table.`});
  });
};

const removeEmotion = (req, res) => {
  const emotion = req.body.emotion;
  if (emotion===undefined || emotion===null) {
    // returning a client error
    res.status(400).json({info: "Request should contain emotion field in body!!!"});
    return;
 }
  
  client.query(`
    DELETE FROM emotions
    WHERE name=$1
  `, [emotion], (err, results) => {
    if (err) {
      console.log(`Log: Error while deleting emotion: ${emotion}, Error: `, err);
      // returning server error
      res.status(500).json({info: `Error while deleting emotion: ${emotion}.`});
    }
    console.log(`Log: Removed emotion: ${emotion} from emotions table.`);
    res.status(200).json({info: `Removed emotion: ${emotion} from emotions table.`});
  });
};




// ----------- Transactions
const getTransactions = (req, res) => {
  client.query(`
    SELECT * FROM transactions
  `, [], (err, results) => {
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

  client.query(`
    INSERT INTO transactions (season, gender, age, emotion, weather, temperature, beverages)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `, [
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

const getMostBoughtBeverage = (req, res) => {
  client.query(`
    SELECT * FROM transactions
  `, [], (err, results) => {
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




// ----------- Heroku DB Table Manipulations

// ----------- Beverages
const createBeveragesTable = (req, res) => {
  client.query(`
    CREATE TABLE beverages (
      id SERIAL PRIMARY KEY,
      name VARCHAR(30)
    )
  `, [], (err, results) => {
    if (err) {
      console.log(`Log: Error while creating beverages table, Error: `, err);
      // returning server error
      res.status(500).json({info: `Log: Error while creating beverages table.`});
      return;
    }
    console.log(`Log: Created beverages table.`);
    res.status(200).json({info: `Log: Created beverages table.`});
  });
};

const clearBeveragesTable = (req, res) => {
  client.query(`
    TRUNCATE beverages
  `, [], (err, results) => {
    if (err) {
      console.log(`Log: Error while clearing beverages table, Error: `, err);
      // returning server error
      res.status(500).json({info: `Error while clearing beverages table.`});
      return;
    }
    console.log(`Log: Cleared beverages table.`);
    res.status(200).json({info: `Cleared beverages table.`});
  });
};

const removeBeveragesTable = (req, res) => {
  client.query(`
    DROP TABLE beverages
  `, [], (err, resuts) => {
    if (err) {
      console.log(`Log: Error while removing beverages table, Error: `, err);
      // returning server error
      res.status(500).json({info: `Error while removing beverages table`});
      return;
    }
    console.log(`Log: Removed beverages table.`);
    res.status(200).json({info: `Removed beverages table.`});
  });
};




// ----------- Tags
const createTagsTable = (req, res) => {
  client.query(`
    CREATE TABLE tags (
      id SERIAL PRIMARY KEY,
      name VARCHAR(30)
    )
  `, [], (err, results) => {
    if (err) {
      console.log(`Log: Error while creating tags table, Error: `, err);
      // returning server error
      res.status(500).json({info: `Log: Error while creating tags table.`});
      return;
    }
    console.log(`Log: Created tags table.`);
    res.status(200).json({info: `Log: Created tags table.`});
  });
};

const clearTagsTable = (req, res) => {
  client.query(`
    TRUNCATE tags
  `, [], (err, results) => {
    if (err) {
      console.log(`Log: Error while clearing tags table, Error: `, err);
      // returning server error
      res.status(500).json({info: `Error while clearing tags table.`});
      return;
    }
    console.log(`Log: Cleared tags table.`);
    res.status(200).json({info: `Cleared tags table.`});
  });
};

const removeTagsTable = (req, res) => {
  client.query(`
    DROP TABLE tags
  `, [], (err, resuts) => {
    if (err) {
      console.log(`Log: Error while removing tags table, Error: `, err);
      // returning server error
      res.status(500).json({info: `Error while removing tags table`});
      return;
    }
    console.log(`Log: Removed tags table.`);
    res.status(200).json({info: `Removed tags table.`});
  });
};




// ----------- Emotions
const createEmotionsTable = (req, res) => {
  client.query(`
    CREATE TABLE emotions (
      id SERIAL PRIMARY KEY,
      name VARCHAR(30)
    )
  `, [], (err, results) => {
    if (err) {
      console.log(`Log: Error while creating emotions table, Error: `, err);
      // returning server error
      res.status(500).json({info: `Error while creating emotions table.`});
      return;
    }
    console.log(`Log: Created emotions table.`);
    res.status(200).json({info: `Created emotions table.`});
  });
};

const clearEmotionsTable = (req, res) => {
  client.query(`
    TRUNCATE emotions
  `, [], (err, results) => {
    if (err) {
      console.log(`Log: Error while clearing emotions table, Error: `, err);
      // returning server error
      res.status(500).json({info: `Error while clearing emotions table.`});
      return;
    }
    console.log(`Log: Cleared emotions table.`);
    res.status(200).json({info: `Cleared emotions table.`});
  });
};

const removeEmotionsTable = (req, res) => {
  client.query(`
    DROP TABLE emotions
  `, [], (err, results) => {
    if (err) {
      console.log(`Log: Error while removing emotions table, Error: `, err);
      // returning server error
      res.status(500).json({info: `Error while removing emotions table.`});
      return;
    }
    console.log(`Log: Removed emotions table.`);
    res.status(200).json({info: `Removed emotions table.`});
  });
};




// ----------- Transactions
const createTransactionsTable = (req, res) => {
  client.query(`
    CREATE TABLE transactions (
      id SERIAL PRIMARY KEY,
      time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      season VARCHAR(30),
      gender VARCHAR(30),
      age INT,
      emotion VARCHAR(30),
      weather VARCHAR(30),
      temperature FLOAT(1),
      beverages TEXT []
    )
  `, [], (err, results) => {
    if (err) {
      console.log(`Log: Error while creating transactions table, Error: `, err);
      // returning server error
      res.status(500).json({info: `Error while creating transactions table.`});
      return;
    }
    console.log(`Log: Created transactions table.`);
    res.status(200).json({info: `Created transactions table.`});
  });
};

const clearTransactionsTable = (req, res) => {
  client.query(`
    TRUNCATE transactions
  `, [], (err, results) => {
    if (err) {
      console.log(`Log: Error while clearing transactions table, Error: `, err);
      // returning server erorr
      res.status(500).json({info: `Error while clearing transactions table.`});
      return;
    }
    console.log(`Log: Cleared transactions table.`);
    res.status(200).json({info: `Cleared transactions table.`});
  });
};

const removeTransactionsTable = (req, res) => {
  client.query(`
    DROP TABLE transactions
  `, [], (err, results) => {
    if (err) {
      console.log(`Log: Error while removing transactions table, Error: `, err);
      // returning server error
      res.status(500).json({info: `Error while removing transactions table.`});
      return;
    }
    console.log(`Log: Removed transactions table.`);
    res.status(200).json({info: `Removed transactions table.`});
  });
};




module.exports = {
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
  addTransaction,

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
  removeTransactionsTable
};