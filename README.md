# Data Collector for [Beverage Recommendation System](https://github.com/Eessh/beverage-recommendation-system/)

A simple api for a database, which stores the transactions made in the app: [Beverage Recommendation System](https://github.com/Eessh/beverage-recommendation-system/)

When a transaction is made, it stores the `time, season, gender, age, emotion_id, weather, temperature` fields in `transactions table`, then it stores beverages in `transactionbeverages table`, and recommended beverages in `transactionrecommendedbeverages table`.


## Api
### Beverage related: `/beverages`
- `GET` - returns all beverages in `beverages table`
- `POST` - adds beverage(`request.body.beverage`) into `beverages table`
- `DELETE` - removes the beverage(`request.body.beverage`) from `beverages table`

### Emotions related: `/emotions`
- `GET` - returns all emotions in `emotions table`
- `POST` - adds emotion(`request.body.emotion`) into `emotion table`
- `DELETE` - removes the emotion(`request.body.emotion`) from `emotion table`

### Transactions related: `/transactions`
- `GET` - returns all transactions in `transactions table`
  - `/transactions/ids` - returns all transactions ids
  - `/transactions/id` - returns a transaction with the specified id(`req.body.id`)
  - `/transactions/id/full` - returns a full transaction(with beverages, recommended_beverages) with specified id (`req.body.id`)
- `POST` - adds transaction(`request.body.transaction`) into `transactions table`, adds beverages(`request.body.transaction.beverages`) into `transactionbeverages table`. See the function which does this thing [over here](https://github.com/Eessh/beverage-recommendation-system-data-collector/blob/aee9a24ee4c597b325ef8bd35dbef28042beb2ca/HerokuDBQueries.js#L232).

### TransactionBeverages related: `/transactionbeverages`
- `GET` - returns all rows in `transactionbeverages table`
  - `/transactionbeverages/id` - returns the rows with the specified transaction_id(`req.body.transaction_id`)

### TransactionRecommendedBeverages related: `/transactionrecommendedbeverages`
- `GET` - returns all rows in `transactionrecommendedbeverages table`
  - `/transactionrecommendedbeverages/id` - returns the rows with the specified transaction_id(`req.body.transaction_id`)

### Settings related: `/settings`
- `GET` - returns all settings(`res.body will be of form: {emotion: "some emotion", tag: "seom beverage tag", state: "0 or 1"}`)
  - `/settings/emotionAndTag` - returns the state(`res.body.state`) of that setting corresponding to the specified emotion and tag
- `POST` - adds a setting to the settings table
- `PATCH` - updates a setting
- `DELETE` - deletes a setting


## Api - DANGER ZONE
### Beverages Table related: `/beveragesTable`
- `POST` - creates `beverages table`
- `PATCH` - clears `beverages table`
- `DELETE` - removes `beverages table` from database

### Emotions Table related: `/emotionsTable`
- `POST` - creates `emotions table`
- `PATCH` - clears `emotions table`
- `DELETE` - removes `emotions table` from database

### Transactions Table related: `/transactionsTable`
- `POST` - creates `transactions table`
- `PATCH` - clears `transactions table`
- `DELETE` - removes `transactions table` from database

### TransactionBeverages Table related: `/transactionbeveragesTable`
- `POST` - creates `transactionbeverages table`
- `PATCH` - clears `transactionbeverages table`
- `DELETE` - removes `transactionbeverages table` from database

### TransactionRecommendedBeverages Table related: `/transactionrecommendedbeveragesTable`
- `POST` - creates `transactionrecommendedbeverages table`
- `PATCH` - clears `transactionrecommendedbeverages table`
- `DELETE` - removes `transactionrecommendedbeverages table` from database

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
### The following tables currently have no use:
> Tags Table
```
  tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30)
  )
```
> BeverageTags Table
```
  beveragetags (
    beverage_id INT NOT NULL REFERENCES beverages(id),
    tag_id INT NOT NULL REFERENCES tags(id),
    PRIMARY KEY (beverage_id, tag_id)
  )
```
> EmotionTags Table
```
  emotiontags (
    emotion_id INT NOT NULL REFERENCES emotions(id),
    tag_id INT NOT NULL REFERENCES tags(id)
    PRIMARY KEY (emotion_id, tag_id)
  )
```
