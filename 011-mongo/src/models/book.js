const {Schema, model} = require("mongoose")

const bookScheme = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    authors: {
        type: String,
        default: Date.now
    },
    fileCover: {
        type: String
    },
    fileName: {
        type: String
    }
})


module.exports = model('Book', bookScheme)