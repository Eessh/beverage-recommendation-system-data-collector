<h1 align="center">
    <img src="./public/logo.svg" valign="middle" width="120" height="120" alt="logo" style="margin: 100px;" />
    <a href="https://beverage-recommendation-system.herokuapp.com">
        <span valign="middle">
                Data Collector API
        </span>
    </a>
</h1>

A simple api for a database, which stores the transactions made in the app: [Beverage Recommendation System](https://github.com/Eessh/beverage-recommendation-system/tree/recommendation_using_only_emotion)

When a transaction is made, it stores the `time, season, gender, age, emotion_id, weather, temperature` fields in `transactions table`, then it stores beverages in `transactionbeverages table`, and recommended beverages in `transactionrecommendedbeverages table`.

Api docs can be accessed at `/api-docs` endpoint.

## Database Schema
> Beverages Table
```
  beverages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30)
  )
```
> Emotions Table
```
  emotions (
    id SERIAL PRIMARY KEY,
    name VARHCAR(30)
  )
```
> Transaction Table
```
  transactions (
    id SERIAL PRIMARY KEY,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    season VARCHAR(30),
    gender VARCHAR(30),
    age INT,
    emotion_id INT NOT NULL REFERENCES emotions(id),
    weather VARCHAR(30),
    temperature FLOAT(1)
  )
```
> TransactionBeverages Table
```
  transactionbeverages (
    transaction_id INT NOT NULL REFERENCES transactions(id),
    beverage_id INT NOT NULL REFERENCES beverages(id),
    PRIMARY KEY (transaction_id, beverage_id)
  )
```
> TransactionRecommendedBeverages Table
```
  transactionrecommendedbeverages (
    transaction_id INT NOT NULL REFERENCES transactions(id),
    beverage_id INT NOT NULL REFERENCES beverages(id),
    PRIMARY KEY (transaction_id, beverage_id)
  )
```
