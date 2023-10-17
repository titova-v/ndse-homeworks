const express = require('express')
const {v4: uuid} = require("uuid")
const bookMulter = require("../middleware/book")
const { Counter } = require('./counter')

const router = express.Router()
const DEFAULT_BOOKS = [
    {
        id: '123-qwerty-456',
        title: 'Alice in Wonderland',
        authors: 'Lewis Carroll',
        favorite: true
    }
]

class Library {
    constructor(storage = []) {
        this.storage = storage
    }
}

const library = new Library(DEFAULT_BOOKS)

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

    res.render("book/index", {
        title: "Books",
        books: storage,
    });
})

router.get('/create', (req, res) => {
    res.render("book/create", {
        title: "Book | create",
        book: {},
    });
});

router.get('/:id', (req, res) => {
    const storage = library.storage
    const {id} = req.params
    const idx = storage.findIndex(el => el.id === id)

    if (idx != -1) {
        Counter.getCount(id, response => {
            if (response.statusCode !== 500) {
                response.setEncoding('utf8')
                let rowData = ''
            
                response.on('data', chunk => {
                    rowData += chunk
                })
            
                response.on('end', () => {
                    let viewCount = JSON.parse(rowData).count

                    res.render("book/view", {
                        title: storage[idx].title,
                        book: storage[idx],
                        viewCount
                    });
                    Counter.setCount(id)
                })
            }
        })
    } else {
        res.redirect('/404') 
    }
})
router.get('/download/:id', (req, res) => {
    const storage = library.storage
    const {id} = req.params
    const idx = storage.findIndex(el => el.id === id)

    if (idx != -1) {
        const book = storage[idx]
        if (book.fileBook)
            res.download(book.fileBook, book.fileName)
        else
            res.redirect('/404') 
    } else {
        res.redirect('/404') 
    }
})

router.post('/create', bookMulter.fields([{name:'fileCover',maxCount:1},{name: 'fileBook', maxCount:1}]), (req, res) => {
    const storage = library.storage
    const {title, description, authors} = req.body
    const favorite = req.body.favorite ? true : false
    const fileCover = (req.files && req.files.fileCover) ? req.files.fileCover[0].filename : undefined
    const fileBook = (req.files && req.files.fileBook) ? req.files.fileBook[0].path : undefined
    const fileName = (req.body.fileName + (fileBook ? `.${fileBook.split('.').reverse()[0]}` : "")) || ((req.files && req.files.fileBook) ? req.files.fileBook[0].filename : undefined)

    const newBook = new Book(title, description, authors, favorite, fileCover, fileName, fileBook)
    
    storage.push(newBook)

    res.redirect('/books')
})

router.get('/update/:id', (req, res) => {
    const storage = library.storage
    const {id} = req.params
    const idx = storage.findIndex(el => el.id === id)

    if (idx != -1) {
        res.render("book/update", {
            title: "Book | update",
            book: storage[idx],
        });
    } else {
        res.redirect('/404')
    }
});

router.post('/update/:id', bookMulter.fields([{name:'fileCover',maxCount:1},{name: 'fileBook', maxCount:1}]), (req, res) => {
    const storage = library.storage
    const {title, description, authors} = req.body
    const favorite = req.body.favorite ? true : false
    const fileCover = (req.files && req.files.fileCover) ? req.files.fileCover[0].filename : undefined
    const fileBook = (req.files && req.files.fileBook) ? req.files.fileBook[0].path : undefined
    const fileName = (req.body.fileName + (fileBook ? `.${fileBook.split('.').reverse()[0]}` : ""))  || ((req.files && req.files.fileBook) ? req.files.fileBook[0].filename : undefined)
    const {id} = req.params

    const idx = storage.findIndex(el => el.id === id)

    if (idx != -1) {
        (title != undefined) && (storage[idx].title = title);
        (description != undefined) && (storage[idx].description = description);
        (authors != undefined) && (storage[idx].authors = authors);
        (favorite != undefined) && (storage[idx].favorite = favorite);
        (fileCover != undefined) && (storage[idx].fileCover = fileCover);
        (fileBook != undefined) && (storage[idx].fileBook = fileBook);
        (fileName != undefined) && (storage[idx].fileName = fileName);

        res.redirect(`/books/${id}`);
    } else {
        res.redirect('/404')
    }
})

router.post('/delete/:id', (req, res) => {
    const storage = library.storage
    const {id} = req.params
    const idx = storage.findIndex(el => el.id === id)

    if (idx != -1) {
        storage.splice(idx, 1)
        res.redirect('/books');
    } else {
        res.redirect('/404')
    }
})

module.exports = router