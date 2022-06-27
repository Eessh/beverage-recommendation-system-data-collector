# Data Collector for [Beverage Recommendation System](https://github.com/Eessh/beverage-recommendation-system/)

A simple api for a database, which stores the transactions made in the app: [Beverage Recommendation System](https://github.com/Eessh/beverage-recommendation-system/)


## Api
### Beverage related: `/beverages`
- `GET` - returns all beverages in `beverages table`
- `POST` - adds beverage(`request.body.beverage`) into `beverages table`
- `DELETE` - removes the beverage(`request.body.beverage`) from `beverages table`

### Transactions related: `/transactions`
- `GET` - returns all transactions in `transactions table` (Edit: Should actually return beverages bought in that transaction too, will implement it :)
- `POST` - adds transaction(`request.body.transaction`) into `transactions table`, adds beverages(`request.body.transaction.beverages`) into `transactionbeverages table`. See the function which does this thing [over here](https://github.com/Eessh/beverage-recommendation-system-data-collector/blob/aee9a24ee4c597b325ef8bd35dbef28042beb2ca/HerokuDBQueries.js#L232).

### Tags related: `/tags`
- `GET` - returns all tags in `tags table`
- `POST` - adds tag(`request.body.tag`) into `tags table`
- `DELETE` - removes the tag(`request.body.tag`) from `tags table`

### Emotions related: `/emotions`
- `GET` - returns all emotions in `emotions table`
- `POST` - adds emotion(`request.body.emotion`) into `emotion table`
- `DELETE` - removes the emotion(`request.body.emotion`) from `emotion table`

## Api - DANGER ZONE
### Beverages Table related: `/beveragesTable`
- `POST` - creates `beverages table`
- `PATCH` - clears `beverages table`
- `DELETE` - removes `beverages table` from database

### Transactions Table related: `/transactionsTable`
- `POST` - creates `transactions table`
- `PATCH` - clears `transactions table`
- `DELETE` - removes `transactions table` from database

### TransactionBeverages Table related: `/transactionbeveragesTable`
- `POST` - creates `transactionbeverages table`
- `PATCH` - clears `transactionbeverages table`
- `DELETE` - removes `transactionbeverages table` from database

## Database Schema
> Beverages Table
```
  beverages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30)
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
> Emotions Table
```
  emotions (
    id SERIAL PRIMARY KEY,
    name VARHCAR(30)
  )
```
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
