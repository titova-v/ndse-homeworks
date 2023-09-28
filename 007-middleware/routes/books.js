const express = require('express')
const path = require('path')
const {v4: uuid} = require("uuid")
const bookMulter = require("../middleware/book")

const router = express.Router()

class Library {
    constructor(storage = []) {
        this.storage = storage
    }
}

const library = new Library()

class Book {
    constructor(title = "", description = "", authors = "", favorite = false, fileCover = "", fileName = "", fileBook = "", id = uuid()) {
        this.id = id
        this.title = title
        this.description = description
        this.authors = authors
        this.favorite = favorite
        this.fileCover = fileCover
        this.fileName = fileName
        this.fileBook = fileBook
    }
}

router.get('/', (req, res) => {
    const storage = library.storage

    res.status(201)
    res.json(storage)
})
router.get('/:id', (req, res) => {
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
router.get('/:id/download', (req, res) => {
    const storage = library.storage
    const {id} = req.params
    const idx = storage.findIndex(el => el.id === id)

    if (idx != -1) {
        const book = storage[idx]
        res.download(book.fileBook)
    } else {
        res.status(404)
        res.json('Code: 404')
    }
})

router.post('/', bookMulter.single("fileBook"), (req, res) => {
    const storage = library.storage
    const {title, description, authors, favorite, fileCover} = req.body
    const fileBook = req.file.path
    const fileName = req.file.filename

    const newBook = new Book(title, description, authors, favorite, fileCover, fileName, fileBook)
    storage.push(newBook)

    console.log(fileBook)

    res.status(201)
    res.json(newBook)
})

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

module.exports = router