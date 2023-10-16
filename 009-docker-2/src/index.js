const express = require("express")
const path = require("path")
const errorMiddleware = require('./middleware/error');

const indexRouter = require('./routes/index');
const booksRouter = require("./routes/books")
const userRouter = require("./routes/user")

const PORT = process.env.PORT || 8000
const app = express()
app.use(express.urlencoded());
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/views'));

app.use('/', indexRouter);

app.use('/books', booksRouter)
app.use('/user', userRouter)

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Library app listening on port ${PORT}`)
  })