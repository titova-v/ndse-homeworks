const express = require("express")
const path = require('path')
const booksRouter = require("./routes/books")
const userRouter = require("./routes/user")

const PORT = process.env.port || 8000
const app = express()

app.use(express.json())

// app.use('/library', express.static(path.join(__dirname, '/library')))
app.use('/api/books', booksRouter)
app.use('/api/user', userRouter)

app.listen(PORT, () => {
    console.log(`Library app listening on port ${PORT}`)
  })