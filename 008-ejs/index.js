const express = require("express")
const errorMiddleware = require('./middleware/error');

const indexRouter = require('./routes/index');
const booksRouter = require("./routes/books")
const userRouter = require("./routes/user")

const PORT = process.env.port || 8000
const app = express()
app.use(express.urlencoded());
app.set("view engine", "ejs");

app.use('/', indexRouter);

app.use('/books', booksRouter)
app.use('/user', userRouter)

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Library app listening on port ${PORT}`)
  })