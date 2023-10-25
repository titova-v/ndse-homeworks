const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const errorMiddleware = require('./middleware/error');

const indexRouter = require('./routes/index');
const apiBooksRouter = require("./routes/api/book")
const booksRouter = require("./routes/book")
const userRouter = require("./routes/user")

const PORT = process.env.PORT || 8000
const dbUrl = process.env.MONGODB_URL || 'mongodb://root:example@mongo:27017'
const dbName = process.env.MONGODB_DB_NAME || 'books'
const app = express()
app.use(express.urlencoded());
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/views'));

app.use('/', indexRouter);

app.use('/api/books', apiBooksRouter)
app.use('/books', booksRouter)
app.use('/user', userRouter)

app.use(errorMiddleware);

async function start(PORT, urlDB) {
  try {
    await mongoose.connect(urlDB, {
      dbName
    })
    app.listen(PORT, () => {
      console.log(`Library app listening on port ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start(PORT, dbUrl)