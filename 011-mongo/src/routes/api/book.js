const express = require("express")
const router = express.Router()
const Book = require("../../models/book")

router.get('/', async (req, res) => {
    try {
        const data = await Book.find().select('-__v')
        res.json(data)
    } catch (e) {
        res.status(500).json(e)
    }
})

router.get('/:id', async (req, res) => {
    const {id} = req.params

    try {
        const data = await Book.findById(id).select('-__v')
        res.json(data)
    } catch (e) {
        res.status(500).json(e)
    }
})

router.post('/', async (req, res) => {
    const {title, description, authors, favorite, fileCover, fileName, fileBook} = req.body
    const newBook = new Book({title, description, authors, favorite, fileCover, fileName, fileBook})

    try {
        await newBook.save()
        res.json(newBook)
    } catch (e) {
        res.status(500).json(e)
    }
})

router.put('/:id', async (req, res) => {
    const {id} = req.params
    const {title, description, authors, favorite, fileCover, fileName, fileBook} = req.body

    try {
        await Book.findByIdAndUpdate(id, {title, description, authors, favorite, fileCover, fileName, fileBook})
        res.redirect(`/api/books/${id}`)
    } catch (e) {
        res.status(500).json(e)
    }
})

router.delete('/:id', async (req, res) => {
    const {id} = req.params

    try {
        await Book.deleteOne({_id: id})
        res.json(true)
    } catch (e) {
        res.status(500).json(e)
    }
})

module.exports = router