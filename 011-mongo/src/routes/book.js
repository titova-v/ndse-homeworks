const express = require('express')
const bookMulter = require("../middleware/book")
const { Counter } = require('./counter')
const Book = require('../models/book')

const router = express.Router()

router.get('/', async (req, res) => {
    const books = await Book.find()

    res.render("book/index", {
        title: "Books",
        books
    });
})

router.get('/create', (req, res) => {
    res.render("book/create", {
        title: "Book | create",
        book: {},
    });
});

router.get('/:id', async (req, res) => {
    let book
    const {id} = req.params

    try {
        book = await Book.findById(id)
    } catch {
        res.redirect('/404') 
    }

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
                    title: book.title,
                    book,
                    viewCount
                });
                Counter.setCount(id)
            })
        }
    })
})

router.get('/download/:id', async (req, res) => {
    let book
    const {id} = req.params

    try {
        book = await Book.findById(id)

        if (book.fileBook)
            res.download(book.fileBook, book.fileName)
        else
            res.redirect('/404') 
    } catch {
        res.redirect('/404') 
    }
})

router.post('/create', bookMulter.fields([{name:'fileCover', maxCount:1},{name: 'fileBook', maxCount:1}]), async (req, res) => {
    const {title, description, authors} = req.body
    const favorite = req.body.favorite ? true : false
    const fileCover = (req.files && req.files.fileCover) ? req.files.fileCover[0].filename : undefined
    const fileBook = (req.files && req.files.fileBook) ? req.files.fileBook[0].path : undefined
    const fileName = (req.body.fileName + (fileBook ? `.${fileBook.split('.').reverse()[0]}` : "")) || ((req.files && req.files.fileBook) ? req.files.fileBook[0].filename : undefined)

    const newBook = new Book({title, description, authors, favorite, fileCover, fileName, fileBook})

    try {
        await newBook.save()
    } catch (e) {
        console.error(e);
        res.redirect('/404')
    }

    res.redirect('/books')
})

router.get('/update/:id', async (req, res) => {
    let book
    const {id} = req.params

    try {
        book = await Book.findById(id)
    } catch {
        res.redirect('/404') 
    }

    res.render("book/update", {
        title: "Book | update",
        book
    });
});

router.post('/update/:id', bookMulter.fields([{name:'fileCover',maxCount:1},{name: 'fileBook', maxCount:1}]), async (req, res) => {
    let book, newParams = {}
    const {id} = req.params

    const {title, description, authors} = req.body
    const favorite = req.body.favorite ? true : false
    const fileCover = (req.files && req.files.fileCover) ? req.files.fileCover[0].filename : undefined
    const fileBook = (req.files && req.files.fileBook) ? req.files.fileBook[0].path : undefined
    const fileName = (req.body.fileName + (fileBook ? `.${fileBook.split('.').reverse()[0]}` : ""))  || ((req.files && req.files.fileBook) ? req.files.fileBook[0].filename : undefined);

    (title != undefined) && (newParams.title = title);
    (description != undefined) && (newParams.description = description);
    (authors != undefined) && (newParams.authors = authors);
    (favorite != undefined) && (newParams.favorite = favorite);
    (fileCover != undefined) && (newParams.fileCover = fileCover);
    (fileBook != undefined) && (newParams.fileBook = fileBook);
    (fileName != undefined) && (newParams.fileName = fileName);

    try {
        book = await Book.findByIdAndUpdate(id, newParams)
    } catch {
        res.redirect('/404') 
    }

    res.redirect(`/books/${id}`);
})

router.post('/delete/:id', async (req, res) => {
    const {id} = req.params

    try {
        await Book.deleteOne({_id: id})
    } catch (e) {
        console.error(e);
        res.redirect('/404')
    }

    res.redirect('/books');
})

module.exports = router