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
  console.log("Log: Error while connecting to database: ", err);
});




// ----------- Utilities
// Checks whether the given table name is present in the schema or not
const tableExists = (tablename) => {
  return new Promise(resolve => {
    client.query(`
      SELECT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname='public' AND tablename=$1
      )
    `, [tablename], (err, results) => {
      if (err) {
        console.log(`Log: Error while checking if table: ${tablename} exists or not, Error: `, err);
        return false;
      }
      resolve(results.rows[0].exists);
    });
  });
};




// ----------- Beverages
const getBeverages = async (req, res) => {
  if (!await tableExists("beverages")) {
    console.log("Log: Table: beverages has not been created yet.");
    // returning a server error
    res.status(500).json({info: "Table: beverages has not been created yet."});
    return;
  }
  else {
    client.query(`
      SELECT * FROM beverages
    `, [], (err, results) => {
      if (err) {
        console.log("Log: Error occurred while getting all beverages: ", err);
        // returning server error
        res.status(500).json({info: "Error occurred while getting all beverages."});
        return;
      }
      console.log("Log: beverages: ", results.rows);
      res.status(200).json(results.rows);
    });
  }
};

const getBeverageById = async (req, res) => {
  if (!await tableExists("beverages")) {
    console.log("Log: Table: beverages has not been created yet.");
    // returning a server error
    res.status(500).json({info: "Table: beverages has not been created yet."});
    return;
  }
  else {
    const id = req.body.beverageId;
    if (id===undefined || id===null) {
      // returning a client error
      res.status(400).json({info: "Request should contain beverageId field in body."});
      return;
    }
    
    client.query(`
      SELECT *
      FROM beverages
      WHERE id=$1
    `, [id], (err, results) => {
      if (err) {
        console.log(`Log: Error while fetching beverage with id: ${id}, Erorr: `, err);
        // returning server error
        res.status(500).json({info: `Error while fetching beverage with id: ${id}.`});
        return;
      }
      if (results.rows.length < 1) {
        // returning client error
        res.status(400).json({info: `No beverage found with id: ${id}.`});
        return;
      }
      console.log(`Log: Fetched beverage with id: ${id}, beverage: ${results.rows[0]}.`);
      res.status(200).json(results.rows[0]);
    });
  }
};

const addBeverage = async (req, res) => {
  if (!await tableExists("beverages")) {
    console.log("Log: Table: beverages has not been created yet.");
    // returning a server error
    res.status(500).json({info: "Table: beverages has not been created yet."});
    return;
  }
  else {
    const beverage = req.body.beverage;
    if (beverage===undefined || beverage===null) {
      // returning a client error
      res.status(400).json({info: "Request should contain beverage field in body."});
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
      res.status(200).json({info: `Added beverage: ${beverage} into beverages table.`});
    });
  }
};

const removeBeverage = async (req, res) => {
  if (!await tableExists("beverages")) {
    console.log("Log: Table: beverages has not been created yet.");
    // returning a server error
    res.status(500).json({info: "Table: beverages has not been created yet."});
    return;
  }
  else {
    const beverage = req.body.beverage;
    if (beverage===undefined || beverage===null) {
      // returning a client error
      res.status(400).json({info: "Request should contain beverage field in body!!!"});
      return;
    }
  
    // checking whether the beverage was present, before deletion
    client.query(`
      SELECT *
      FROM beverages
      WHERE name=$1
    `, [beverage], (err0, results0) => {
      if (err0) {
        console.log(`Log: Error while checking for presence of beverage: ${beverage} in beverages table, Error: `, err);
        // returning server error
        res.status(500).json({info: `Error while checking for presence of beverage: ${beverage} in beverages table.`});
        return;
      }
      if (results0.rows.length < 1) {
        console.log(`Log: Beverage: ${beverage} was not found in beverages table, hence cannot be deleted.`);
        // returning client error
        res.status(400).json({info: `Beverage: ${beverage} was not found in beverages table, hence cannot be deleted.`});
        return;
      }
      else {
        // deleting beverage
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
      }
    });
  }
};




// ----------- Emotions
const getEmotions = async (req, res) => {
  if (!await tableExists("emotions")) {
    console.log("Log: Table: emotions has not been created yet.");
    // returning a server error
    res.status(500).json({info: "Table: emotions has not been created yet."});
    return;
  }
  else {
    client.query(`
      SELECT * FROM emotions
    `, [], (err, results) => {
      if (err) {
        console.log(`Log: Error while getting all emotions: `, err);
        // returning server error
        res.status(500).json({info: `Error while getting all emotions.`});
      }
      console.log("Log: emotions: ", results.rows);
      res.status(200).json(results.rows);
    });
  }
};

const getEmotionById = async (req, res) => {
  if (!await tableExists("emotions")) {
    console.log("Log: Table: emotions has not been created yet.");
    // returning a server error
    res.status(500).json({info: "Table: emotions has not been created yet."});
    return;
  }
  else {
    const id = req.body.emotionId;
    if (id===undefined || id===null) {
      // returning a client error
      res.status(400).json({info: "Request should contain emotionId field in body."});
      return;
    }
    
    client.query(`
      SELECT *
      FROM emotions
      WHERE id=$1
    `, [id], (err, results) => {
      if (err) {
        console.log(`Log: Error while fetching emotion with id: ${id}, Erorr: `, err);
        // returning server error
        res.status(500).json({info: `Error while emotion beverage with id: ${id}.`});
        return;
      }
      if (results.rows.length < 1) {
        // returning client error
        res.status(400).json({info: `No emotion found with id: ${id}.`});
        return;
      }
      console.log(`Log: Fetched emotion with id: ${id}, emotion: ${results.rows[0]}.`);
      res.status(200).json(results.rows[0]);
    });
  }
};

const addEmotion = async (req, res) => {
  if (!await tableExists("emotions")) {
    console.log("Log: Table: emotions has not been created yet.");
    // returning a server error
    res.status(500).json({info: "Table: emotions has not been created yet."});
    return;
  }
  else {
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
  }
}

const removeEmotion = async (req, res) => {
  if (!await tableExists("emotions")) {
    console.log("Log: Table: emotions has not been created yet.");
    // returning a server error
    res.status(500).json({info: "Table: emotions has not been created yet."});
    return;
  }
  else {
    const emotion = req.body.emotion;
    if (emotion===undefined || emotion===null) {
      // returning a client error
      res.status(400).json({info: "Request should contain emotion field in body!!!"});
      return;
    }
    
    client.query(`
      SELECT *
      FROM emotions
      WHERE name=$1
    `, [emotion], (err0, results0) => {
      if (err0) {
        console.log(`Log: Error while checking presence of emotion: ${emotion} in emotions table, Error: `, err);
        // returning server error
        res.status(500).json({info: `Error while checking presence of emotion: ${emotion} in emotions table.`});
        return;
      }
      if (results0.rows.length < 1) {
        console.log(`Log: Emotion: ${emotion} was not found in emotions table, hence cannot be deleted.`);
        // returning client error
        res.status(400).json({info: `Emotion: ${emotion} was not found in emotions table, hence cannot be deleted.`});
        return;
      }
      else {
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
      }
    });
  }
};




// ----------- Transactions
const getTransactions = async (req, res) => {
  if (!await tableExists("transactions")) {
    console.log("Log: Table: transactions has not been created yet.");
    // returning a server error
    res.status(500).json({info: "Table: transactions has not been created yet."});
    return;
  }
  else {
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
      res.status(200).json(results.rows);
    });
  }
};

const getTransactionsIds = async (req, res) => {
  if (!await tableExists("transactions")) {
    console.log("Log: Table: transactions has not been created yet.");
    // returning a server error
    res.status(500).json({info: "Table: transactions has not been created yet."});
    return;
  }
  client.query(`
    SELECT id
    FROM transactions
  `, [], (err, results) => {
    if (err) {
      console.log(`Log: Error occurred while getting all id's of transactions, Error: `, err);
      // returning a server error
      res.status(500).json({info: `Error occurred while getting all id's of transactions.`});
      return;
    }
    res.status(200).json(results.rows);
  });
};

const getTransactionById = async (req, res) => {
  if (!await tableExists("transactions")) {
    console.log("Log: Table: transactions has not been created yet.");
    // returning a server error
    res.status(500).json({info: "Table: transactions has not been created yet."});
    return;
  }
  const transactionId = req.body.transactionId;
  if (transactionId===undefined || transactionId===null) {
    // returning a client error
    res.status(400).json({info: "Request should contain a transactionId field in body."});
    return;
  }
  else {
    client.query(`
      SELECT *
      FROM transactions
      WHERE id=$1
    `, [transactionId], (err, results) => {
      if (err) {
        console.log(`Log: Error occurred while getting transaction, transaction_id: ${transactionId}, Error: `, err)
        // returning a server error
        res.status(500).json({info: `Error occurred while getting transaction, transaction_id: ${transactionId}.`});
        return;
      }
      if (results.rows.length < 1) {
        console.log("Log: Cannot find a transaction with id: ", transactionId);
        res.status(400).json({info: `Cannot find a transaction with id: ${transactionId}.`});
        return;
      }
      console.log("Log: transaction: ", results.rows[0]);
      res.status(200).json({transaction: results.rows[0]});
    });
  }
};

const getFullTransactionById = async (req, res) => {
  if (!await tableExists("beverages")) {
    console.log("Log: Table: beverages has not been created yet.");
    // returning a server error
    res.status(500).json({info: "Table: beverages has not been created yet."});
    return;
  }
  if (!await tableExists("transactions")) {
    console.log("Log: Table: transactions has not been created yet.");
    // returning a server error
    res.status(500).json({info: "Table: transactions has not been created yet."});
    return;
  }
  if (!await tableExists("transactionbeverages")) {
    console.log("Log: Table: transactionbeverages has not been created yet.");
    // returning a server error
    res.status(500).json({info: "Table: transactionbeverages has not been created yet."});
    return;
  }
  if (!await tableExists("transactionrecommendedbeverages")) {
    console.log("Log: Table: transactionrecommendedbeverages has not been created yet.");
    // returning a server error
    res.status(500).json({info: "Table: transactionrecommendedbeverages has not been created yet."});
    return;
  }
  const transactionId = req.body.transactionId;
  let transactionData;
  if (transactionId===undefined || transactionId===null) {
    // returning a client error
    res.status(400).json({info: "Request should contain a transactionId field in body."});
    return;
  }
  else {
    client.query(`
      SELECT transaction.id as id, time, season, age, gender, emotions.name as emotion, weather, temperature
      FROM emotions, (
        SELECT *
        FROM transactions
        WHERE transactions.id=$1
      ) as transaction
      WHERE transaction.emotion_id=emotions.id
    `, [transactionId], (err0, results0) => {
      if (err0) {
        console.log(`Log: Error occurred while getting transaction, transaction_id: ${transactionId}, Error: `, err0);
        // returning a server error
        res.status(500).json({info: `Error occurred while getting transaction, transaction_id: ${transactionId}.`});
        return;
      }
      if (results0.rows.length < 1) {
        console.log(`Log: Cannot find a row with id: ${transactionId} in transactions table.`);
        // returning a client error
        res.status(400).json({info: `Cannot find a row with id: ${transactionId} in transactions table.`});
        return;
      }
      transactionData = results0.rows[0];
      client.query(`
        SELECT name
        FROM beverages
        WHERE id IN (
          SELECT beverage_id
          FROM transactionbeverages
          WHERE transaction_id=$1
        )
      `, [transactionId], (err1, results1) => {
        if (err1) {
          console.log(`Log: Error occurred while getting transaction beverages, transaction_id: ${transactionId}, Error: `, err1);
          // returning a server error
          res.status(500).json({info: `Error occurred while getting transaction beverages, transaction_id: ${transactionId}.`});
          return;
        }
        if (results1.rows.length < 1) {
          console.log(`Log: Cannot find a row with transaction_id: ${transactionId} in transactionbeverages table.`)
          // returning a server erorr
          res.status(500).json({info: `Cannot find a row with transaction_id: ${transactionId} in transactionbeverages table.This error may have occured while adding a transaction (inserting beverages into transactionbeverages table).`});
          return;
        }
        transactionData.beverages = [];
        results1.rows.forEach(beverage => transactionData.beverages.push(beverage));
        client.query(`
          SELECT name
          FROM beverages
          WHERE id IN (
            SELECT beverage_id
            FROM transactionrecommendedbeverages
            WHERE transaction_id=$1
          )
        `, [transactionId], (err2, results2) => {
          if (err2) {
            console.log(`Log: Error occurred while getting transaction recommended beverages, transaction_id: ${transactionData}, Error: `, err2);
            // returning a server error
            res.status(500).json({info: `Error occurred while getting transaction recommended beverages, transaction_id: ${transactionData}.`});
            return;
          }
          if (results2.rows.length < 1) {
            console.log(`Log: Cannot find a row with transaction_id: ${transactionId} in transactionrecommendedbeverages table.`);
            // returning a server error
            res.status(500).json({info: `Cannot find a row with transaction_id: ${transactionId} in transactionrecommendedbeverages table.This error may have occured while adding a transaction (inserting recommended_beverages into transactionrecommendedbeverages table).`});
            return;
          }
          transactionData.recommendedBeverages = [];
          results2.rows.forEach(recommendedBeverage => transactionData.recommendedBeverages.push(recommendedBeverage));
          res.status(200).json({transactionData: transactionData});
        });
      });
    });
  }
};

const addTransaction = async (req, res) => {
  if (!await tableExists("transactions") || !await tableExists("emotions") || !await tableExists("beverages")) {
    console.log("Log: Transaction couldn't be added, reasons: transactions table is not created (or) emotions table is not created (or) beverages table is not created.");
    // returning a server error
    res.status(500).json({info: "Transaction couldn't be added, reasons: transactions table is not created (or) emotions table is not created (or) beverages table is not created."});
    return;
  }
  else {
    const transactionData = req.body.transaction;

    // returning some possible client errors
    if (transactionData===undefined || transactionData===null) {
      res.status(400).json({info: "Request should contain transaction field in body, about transaction"});
      return;
    }
    if (transactionData.emotion===undefined || transactionData.emotion===null) {
      res.status(400).json({info: "Request should contain: request.body.transaction.emotion field."});
      return;
    }
    if (transactionData.beverages===undefined || transactionData.beverages===null) {
      res.status(400).json({info: "Request should contain: request.body.transaction.beverages."});
      return;
    }
    if (transactionData.recommended_beverages===undefined || transactionData.recommended_beverages===null) {
      res.status(400).json({info: "Request should contain: request.body.transaction.recommended_beverages."});
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

    client.query(`BEGIN`, [], (err0, results0) => {
      if (err0) {
        console.log(`Log: Error occurred for BEGIN query, Error: `, err0);
        // returning server error
        res.status(500).json({info: `Error occurred for BEGIN query.`});
        return;
      }
      else {
        client.query(`
          INSERT INTO transactions (season, gender, age, emotion_id, weather, temperature)
          SELECT $1, $2, $3, id, $5, $6
          FROM emotions
          WHERE name=$4
          RETURNING id
        `, [
          transactionData.season,
          transactionData.gender,
          parseInt(transactionData.age),
          transactionData.emotion,
          transactionData.weather,
          parseInt(transactionData.temperature),
        ], (err1, results1) => {
          if (err1) {
            console.log("Log: Error occurred while inserting a transaction: ", err1);
            // returning a server error
            res.status(500).json({info: "Error occurred while inserting a transaction"});
            return;
          }
          else {
            console.log("Log: transaction added\n", "Log: Adding beverages into transactionbeverages table...");
            if (results1.rows.length < 1) {
              console.log(`Log: Error while inserting transactionData into transactions table.`);
              res.status(500).json({info: `Error while inserting transactionData into transactions table.`});
              // Need to rollback
              client.query(`ROLLBACK`, [], (err2, results2) => {});
              return;
            }
            else {
              let addedBeverages = false, addedRecommendedBeverages = false;
              // Adding beverages to transactionbeverages table
              transactionData.beverages.forEach((beverage, index) => {
                client.query(`
                  INSERT INTO transactionbeverages (transaction_id, beverage_id)
                  SELECT $1, id
                  FROM beverages
                  WHERE name=$2
                `, [results1.rows[0].id, beverage], (err3, results3) => {
                  if (err3) {
                    console.log(`Log: Error occurred while inserting beverage: ${beverage}, into transactionbeverages table, Error: `, err3);
                    // returning a server error
                    res.status(500).json({info: `Error occurred while inserting beverage: ${beverage}, into transactionbeverages table.`});
                    // Need to rollback
                    client.query(`ROLLBACK`, [], (err4, results4) => {});
                    return;
                  }
                  else if (index === transactionData.beverages.length-1) {
                    addedBeverages = true;
                  }
                });
              });
              // Adding recommended_beverages to transactionrecommendedbeverages table
              transactionData.recommended_beverages.forEach((recommendedBeverage, index) => {
                client.query(`
                  INSERT INTO transactionrecommendedbeverages (transaction_id, beverage_id)
                  SELECT $1, id
                  FROM beverages
                  WHERE name=$2
                `, [results1.rows[0].id, recommendedBeverage], (err5, results5) => {
                  if (err5) {
                    console.log(`Log: Error occurred while inserting beverage: ${recommendedBeverage}, into transactionrecommendedbeverages table, Error: `, err5);
                    // returning a server error
                    res.status(500).json({info: `Error occurred while inserting beverage: ${recommendedBeverage}, into transactionrecommendedbeverages table.`});
                    // Need to rollback
                    client.query(`ROLLBACK`, [], (err6, results6) => {});
                    return;
                  }
                  else if (index === transactionData.recommended_beverages.length-1) {
                    addedRecommendedBeverages = true;
                  }
                });
              });

              // watch for completion
              const interval = setInterval(() => {
                if (addedBeverages && addedRecommendedBeverages) {
                  client.query(`COMMIT`, [], (err6, results6) => {});
                  clearInterval(interval);
                  res.status(200).json({info: "Added transaction"});
                }
              }, 50);
            }
          }
        });
      }
    });

    // // Adding transaction to transactions table
    // client.query(`
    //   INSERT INTO transactions (season, gender, age, emotion_id, weather, temperature)
    //   SELECT $1, $2, $3, id, $5, $6
    //   FROM emotions
    //   WHERE name=$4
    //   RETURNING id
    // `, [
    //   transactionData.season,
    //   transactionData.gender,
    //   parseInt(transactionData.age),
    //   transactionData.emotion,
    //   transactionData.weather,
    //   parseInt(transactionData.temperature),
    // ], (err, results) => {
    //   if (err) {
    //     console.log("Log: Error occurred while inserting a transaction: ", err);
    //     // returning a server error
    //     res.status(500).json({info: "Error occurred while inserting a transaction"});
    //     return;
    //   }
    //   console.log("Log: transaction added\n", "Log: Adding beverages into transactionbeverages table...");
    //   if (results.rows.length === 0) {
    //     console.log(`Log: Error while inserting transactionData into transactions table.`);
    //     res.status(500).json({info: `Error while inserting transactionData into transactions table.`});
    //     return;
    //   }
    //   else {
    //     // Adding beverages to transactionbeverages table
    //     transactionData.beverages.forEach((beverage, index) => {
    //       client.query(`
    //         INSERT INTO transactionbeverages (transaction_id, beverage_id)
    //         SELECT $1, id
    //         FROM beverages
    //         WHERE name=$2
    //       `, [results.rows[0].id, beverage], (inner_query_err, inner_query_results) => {
    //         if (inner_query_err) {
    //           console.log(`Log: Error occurred while inserting beverage: ${beverage}, into transactionbeverages table, Error: `, inner_query_err);
    //           // returning a server error
    //           res.status(500).json({info: `Error occurred while inserting beverage: ${beverage}, into transactionbeverages table.`});
    //           return;
    //         }
    //         else if (index === transactionData.beverages.length-1) {}
    //       });
    //     });
    //     console.log(`Log: Added beverages: ${transactionData.beverages} into transactionbeverages table.`);

    //     // Adding recommended_beverages to transactionrecommendedbeverages table
    //     transactionData.recommended_beverages.forEach((beverage, index) => {
    //       client.query(`
    //         INSERT INTO transactionrecommendedbeverages (transaction_id, beverage_id)
    //         SELECT $1, id
    //         FROM beverages
    //         WHERE name=$2
    //       `, [results.rows[0].id, beverage], (inner_query_err, inner_query_results) => {
    //         if (inner_query_err) {
    //           console.log(`Log: Error occurred while inserting beverage: ${beverage}, into transactionrecommendedbeverages table, Error: `, inner_query_err);
    //           // returning a server error
    //           res.status(500).json({info: `Error occurred while inserting beverage: ${beverage}, into transactionrecommendedbeverages table.`});
    //           return;
    //         }
    //         else if (index === transactionData.recommended_beverages.length-1) {}
    //       });
    //     });

    //     // Finally responding with success code
    //     res.status(200).json({info: "Transaction added"});
    //   }
    // });
  }
};




// ----------- Transaction Beverages
const getTransactionBeverages = async (req, res) => {
  if (!await tableExists("transactionbeverages")) {
    console.log("Log: Table: transactionbeverages has not been created yet.");
    // returning a server error
    res.status(500).json({info: "Table: transactionbeverages has not been created yet."});
    return;
  }
  client.query(`
    SELECT *
    FROM transactionbeverages
  `, [], (err, results) => {
    if (err) {
      console.log(`Log: Error while getting transactions beverages, Error: `, err);
      // returning a server error;
      res.status(500).json({info: `Error while getting transaction beverages.`});
      return;
    }
    res.status(200).json(results.rows);
  });
};

const getTransactionBeveragesById = async (req, res) => {
  if (!await tableExists("beverages")) {
    console.log("Log: Table: beverages has not been created yet.");
    // returning a server error
    res.status(500).json({info: "Table: beverages has not been created yet."});
    return;
  }
  if (!await tableExists("transactionbeverages")) {
    console.log("Log: Table: transactionbeverages has not been created yet.");
    // returning a server error
    res.status(500).json({info: "Table: transactionbeverages has not been created yet."});
    return;
  }
  const transactionId = req.body.transactionId;
  if (transactionId===undefined || transactionId===null) {
    // returning a client error
    res.status(400).json({info: "Request should contain a transactionId field in body."});
    return;
  }
  client.query(`
    SELECT name
    FROM beverages
    WHERE id IN (
      SELECT beverage_id
      FROM transactionbeverages
      WHERE transaction_id=$1
    )
  `, [transactionId], (err, results) => {
    if (err) {
      console.log(`Log: Error while getting transaction beverages, transaction_id: ${transactionId}, Error: `, err);
      // returning a server error
      res.status(500).json({info: `Error while getting transaction beverages, transaction_id: ${transactionId}.`});
      return;
    }
    if (results.rows.length < 1) {
      console.log(`Log: Cannot find a row with id: ${transactionId} in transactionbeverages table.`);
      // returning a client error
      res.status(400).json({info: `Cannot find a row with id: ${transactionId} in transactionbeverages table.`});
      return;
    }
    console.log(`Log: Row with id: ${transactionId} in transactionbeverages table: `, results.rows);
    res.status(200).json(results.rows);
  });
};




// ----------- Transaction Recommended Beverages
const getTransactionRecommendedBeverages = async (req, res) => {
  if (!await tableExists("transactionrecommendedbeverages")) {
    console.log("Log: Table: transactionrecommendedbeverages has not been created yet.");
    // returning a server error
    res.status(500).json({info: "Table: transactionrecommendedbeverages has not been created yet."});
    return;
  }
  client.query(`
    SELECT *
    FROM transactionrecommendedbeverages
  `, [], (err, results) => {
    if (err) {
      console.log(`Log: Error while getting transactions recommended beverages, Error: `, err);
      // returning a server error;
      res.status(500).json({info: `Error while getting transactions recommended beverages.`});
      return;
    }
    res.status(200).json(results.rows);
  });
};

const getTransactionRecommendedBeveragesById = async (req, res) => {
  if (!await tableExists("beverages")) {
    console.log("Log: Table: beverages has not been created yet.");
    // returning a server error
    res.status(500).json({info: "Table: beverages has not been created yet."});
    return;
  }
  if (!await tableExists("transactionrecommendedbeverages")) {
    console.log("Log: Table: transactionrecommendedbeverages has not been created yet.");
    // returning a server error
    res.status(500).json({info: "Table: transactionrecommendedbeverages has not been created yet."});
    return;
  }
  const transactionId = req.body.transactionId;
  if (transactionId===undefined || transactionId===null) {
    // returning a client error
    res.status(400).json({info: "Request should contain a transactionId field in body."});
    return;
  }
  client.query(`
    SELECT name
    FROM beverages
    WHERE id IN (
      SELECT beverage_id
      FROM transactionrecommendedbeverages
      WHERE transaction_id=$1
    )
  `, [transactionId], (err, results) => {
    if (err) {
      console.log(`Log: Error while getting transaction recommended beverages, transaction_id: ${transactionId}, Error: `, err);
      // returning a server error;
      res.status(500).json({info: `Error while getting transaction recommended beverages, transaction_id: ${transactionId}.`});
      return;
    }
    if (results.rows.length < 1) {
      console.log(`Log: Cannot find a row with id: ${transactionId} in transactionrecommendedbeverages table.`);
      // returning a client error
      res.status(400).json({info: `Cannot find a row with id: ${transactionId} in transactionrecommendedbeverages table.`});
      return;
    }
    console.log(`Log: Row with id: ${transactionId} in transactionrecommendedbeverages table: `, results.rows);
    res.status(200).json(results.rows);
  });
};




// ----------- Heroku DB Table Manipulations

// ----------- Beverages
const createBeveragesTable = async (req, res) => {
  if (await tableExists("beverages")) {
    console.log("Log: Table: beverages already exists.");
    // returning a client error
    res.status(400).json({info: `Table: beverages already exists.`});
    return;
  }
  else {
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
      res.status(200).json({info: `Created beverages table.`});
    });
  }
};

const clearBeveragesTable = async (req, res) => {
  if (!await tableExists("beverages")) {
    console.log("Log: Table: beverages doesn't exist.");
    // returning a client error
    res.status(400).json({info: `Table: beverages doesn't exist.`});
    return;
  }
  else {
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
  }
};

const removeBeveragesTable = async (req, res) => {
  if (!await tableExists("beverages")) {
    console.log("Log: Table: beverages doesn't exist.");
    // returning a client error
    res.status(400).json({info: `Table: beverages doesn't exist.`});
    return;
  }
  else {
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
  }
};




// ----------- Emotions
const createEmotionsTable = async (req, res) => {
  if (await tableExists("emotions")) {
    console.log("Log: Table: emotions already exists.");
    // returning a client error
    res.status(400).json({info: `Table: emotions already exists.`});
    return;
  }
  else {
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
  }
};

const clearEmotionsTable = async (req, res) => {
  if (!await tableExists("emotions")) {
    console.log("Log: Table: emotions doesn't exist.");
    // returning a client error
    res.status(400).json({info: `Table: emotions doesn't exist.`});
    return;
  }
  else {
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
  }
};

const removeEmotionsTable = async (req, res) => {
  if (!await tableExists("emotions")) {
    console.log("Log: Table: emotions doesn't exist.");
    // returning a client error
    res.status(400).json({info: `Table: emotions doesn't exist.`});
    return;
  }
  else {
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
  }
};




// ----------- Transactions
const createTransactionsTable = async (req, res) => {
  if (await tableExists("transactions") || !await tableExists("emotions")) {
    console.log("Log: Table: transactions couldn't be created, reasons: emotions table is not created (or) transactions table is already present.");
    // returning a client error
    res.status(400).json({info: `Table: transactions couldn't be created, reasons: emotions table is not created (or) transactions table is already present.`});
    return;
  }
  else {
    client.query(`
      CREATE TABLE transactions (
        id SERIAL PRIMARY KEY,
        time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        season VARCHAR(30),
        gender VARCHAR(30),
        age INT,
        emotion_id INT NOT NULL REFERENCES emotions(id),
        weather VARCHAR(30),
        temperature FLOAT(1)
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
  }
};

const clearTransactionsTable = async (req, res) => {
  if (!await tableExists("transactions")) {
    console.log("Log: Table: transactions doesn't exist.");
    // returning a client error
    res.status(400).json({info: `Table: transactions doesn't exist.`});
    return;
  }
  else {
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
  }
};

const removeTransactionsTable = async (req, res) => {
  if (!await tableExists("transactions")) {
    console.log("Log: Table: transactions doesn't exist.");
    // returning a client error
    res.status(400).json({info: `Table: transactions doesn't exist.`});
    return;
  }
  else {
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
  }
};




// ----------- Transaction-Beverages
const createTransactionBeveragesTable = async (req, res) => {
  if (await tableExists("transactionbeverages") || !await tableExists("transactions") || !await tableExists("beverages")) {
    console.log("Log: Table: transactionbeverages couldn't be created, reasons: transactions table is not created (or) beverages table is not created (or) transactionbeverages table is already present.");
    // returning a client error
    res.status(400).json({info: `Table: transactionbeverages couldn't be created, reasons: transactions table is not created (or) beverages table is not created (or) transactionbeverages table is already present.`});
    return;
  }
  else {
    client.query(`
      CREATE TABLE transactionbeverages (
        transaction_id INT NOT NULL REFERENCES transactions(id),
        beverage_id INT NOT NULL REFERENCES beverages(id),
        PRIMARY KEY (transaction_id, beverage_id)
      )
    `, [], (err, results) => {
      if (err) {
        console.log(`Log: Error while transactionbeverages table, Error: `, err);
        // returning server error
        res.status(500).json({info: `Error while creating transactionbeverages table.`});
        return;
      }
      console.log(`Log: Created transactionbeverages table.`);
      res.status(200).json({info: `Created treansactionbeverages table.`});
    });
  }
};

const clearTransactionBeveragesTable = async (req, res) => {
  if (!await tableExists("transactionbeverages")) {
    console.log("Log: Table: transactionbeverages doesn't exist.");
    // returning a client error
    res.status(400).json({info: `Table: transactionbeverages doesn't exist.`});
    return;
  }
  else {
    client.query(`
      TRUNCATE transactionbeverages
    `, [], (err, results) => {
      if (err) {
        console.log(`Log: Error while clearing transactionbeverages table, Error: `, err);
        // returning server error
        res.status(500).json({info: `Error while clearing transactionbeverages table.`});
        return;
      }
      console.log(`Log: Cleared transactionbeverages table.`);
      res.status(200).json({info: `Cleared transactionbeverages table.`});
    });
  }
};

const removeTransactionBeveragesTable = async (req, res) => {
  if (!await tableExists("transactionbeverages")) {
    console.log("Log: Table: transactionbeverages doesn't exist.");
    // returning a client error
    res.status(400).json({info: `Table: transactionbeverages doesn't exist.`});
    return;
  }
  else {
    client.query(`
      DROP TABLE transactionbeverages
    `, [], (err, results) => {
      if (err) {
        console.log(`Log: Error while removing transactionbeverages table, Error: `, err);
        // returning server error
        res.status(500).json({info: `Error while removing transactionbeverages table.`});
        return;
      }
      console.log(`Log: Removed transactionbeverages table.`);
      res.status(200).json({info: `Removed transactionbeverages table.`});
    });
  }
};




// ----------- Transaction-Recommended-Beverages
const createTransactionRecommendedBeveragesTable = async (req, res) => {
  if (await tableExists("transactionrecommendedbeverages") || !await tableExists("transactions") || !await tableExists("beverages")) {
    console.log("Log: Table: transactionrecommendedbeverages couldn't be created, reasons: transactions table is not created (or) beverages table is not created (or) transactionrecommendedbeverages table is already present.");
    // returning a client error
    res.status(400).json({info: `Table: transactionrecommendedbeverages couldn't be created, reasons: transactions table is not created (or) beverages table is not created (or) transactionrecommendedbeverages table is already present.`});
    return;
  }
  else {
    client.query(`
      CREATE TABLE transactionrecommendedbeverages (
        transaction_id INT NOT NULL REFERENCES transactions(id),
        beverage_id INT NOT NULL REFERENCES beverages(id),
        PRIMARY KEY (transaction_id, beverage_id)
      )
    `, [], (err, results) => {
      if (err) {
        console.log(`Log: Error while creating transactionrecommendedbeverages table, Error: `, err);
        // returning server error
        res.status(500).json({info: `Error while creating transactionrecommendedbeverages table.`});
        return;
      }
      console.log(`Log: Created transactionrecommendedbeverages table.`);
      res.status(200).json({info: `Created transactionrecommendedbeverages table.`});
    });
  }
};

const clearTransactionRecommendedBeveragesTable = async (req, res) => {
  if (!await tableExists("transactionrecommendedbeverages")) {
    console.log("Log: Table: transactionrecommendedbeverages doesn't exist.");
    // returning a client error
    res.status(400).json({info: `Table: transactionrecommendedbeverages doesn't exist.`});
    return;
  }
  else {
    client.query(`
      TRUNCATE transactionrecommendedbeverages
    `, [], (err, results) => {
      if (err) {
        console.log(`Log: Error while truncating transactionrecommendedbeverages table, Error: `, err);
        // returning server error
        res.status(500).json({info: `Error while truncating transactionrecommendedbeverages table.`});
        return;
      }
      console.log(`Log: Cleared transactionrecommendedbeverages table.`);
      res.status(200).json({info: `Cleared transactionrecommendedbeverages table.`});
    });
  }
};

const removeTransactionRecommendedBeveragesTable = async (req, res) => {
  if (!await tableExists("transactionrecommendedbeverages")) {
    console.log("Log: Table: transactionrecommendedbeverages doesn't exist.");
    // returning a client error
    res.status(400).json({info: `Table: transactionrecommendedbeverages doesn't exist.`});
    return;
  }
  else {
    client.query(`
      DROP TABLE transactionrecommendedbeverages
    `, [], (err, results) => {
      if (err) {
        console.log(`Log: Error while removing transactionrecommendedbeverages table, Error: `, err);
        // returning server error
        res.status(500).json({info: `Error while removing transactionrecommendedbeverages table.`});
        return;
      }
      console.log(`Log: Removed transactionrecommendedbeverages table.`);
      res.status(200).json({info: `Removed transactionrecommendedbeverages table.`});
    });
  }
};




module.exports = {
  getBeverages,
  getBeverageById,
  addBeverage,
  removeBeverage,
  
  getEmotions,
  getEmotionById,
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

  createBeveragesTable,
  clearBeveragesTable,
  removeBeveragesTable,
  
  createEmotionsTable,
  clearEmotionsTable,
  removeEmotionsTable,
  
  createTransactionsTable,
  clearTransactionsTable,
  removeTransactionsTable,

  createTransactionBeveragesTable,
  clearTransactionBeveragesTable,
  removeTransactionBeveragesTable,

  createTransactionRecommendedBeveragesTable,
  clearTransactionRecommendedBeveragesTable,
  removeTransactionRecommendedBeveragesTable,
};