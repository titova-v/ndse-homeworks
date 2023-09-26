const express = require("express")
const {v4: uuid} = require("uuid")

class Library {
    constructor(storage = []) {
        this.storage = storage
    }
}

class Book {
    constructor(title = "", description = "", authors = "", favorite = "", fileCover = "", fileName = "", id = uuid()) {
        this.id = id
        this.title = title
        this.description = description
        this.authors = authors
        this.favorite = favorite
        this.fileCover = fileCover
        this.fileName = fileName
    }
}

const PORT = process.env.port || 8000
const app = express()
const library = new Library()

app.use(express.json())

app.get('/api/books', (req, res) => {
    const storage = library.storage

    res.status(201)
    res.json(storage)
})
app.get('/api/books/:id', (req, res) => {
    const storage = library.storage
    const {id} = req.params
    const idx = storage.findIndex(el => el.id === id)

    if (idx != -1) {
        res.status(201)
        res.json(storage[idx])
    } else {
        res.status(404)
        res.json('Code: 404')
    }
})

app.post('/api/user/login', (req, res) => {
    res.status(201)
    res.json({"id": "1", "mail": "test@mail.ru"})

})
app.post('/api/books/', (req, res) => {
    const storage = library.storage
    const {title, description, authors, favorite, fileCover, fileName} = req.body

    const newBook = new Book(title, description, authors, favorite, fileCover, fileName)
    storage.push(newBook)

    res.status(201)
    res.json(newBook)
})
app.put('/api/books/:id', (req, res) => {
    const storage = library.storage
    const {title, description, authors, favorite, fileCover, fileName} = req.body
    const {id} = req.params

    const idx = storage.findIndex(el => el.id === id)

    if (idx != -1) {
        (title != undefined) && (storage[idx].title = title);
        (description != undefined) && (storage[idx].description = description);
        (authors != undefined) && (storage[idx].authors = authors);
        (favorite != undefined) && (storage[idx].favorite = favorite);
        (fileCover != undefined) && (storage[idx].fileCover = fileCover);
        (fileName != undefined) && (storage[idx].fileName = fileName);

        res.status(201)
        res.json(storage[idx])
    } else {
        res.status(404)
        res.json('Code: 404')
    }
})
app.delete('/api/books/:id', (req, res) => {
    const storage = library.storage
    const {id} = req.params
    const idx = storage.findIndex(el => el.id === id)

    if (idx != -1) {
        storage.splice(idx, 1)
        res.status(201)
        res.json('ok')
    } else {
        res.status(404)
        res.json('Code: 404')
    }
})

app.listen(PORT, () => {
    console.log(`Library app listening on port ${PORT}`)
  })