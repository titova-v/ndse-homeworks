const multer = require('multer')

const storage = multer.diskStorage({
    destination(req, file, cb){
        if (file.fieldname === "fileBook") {
            cb(null, 'library/books')
        }
        else if (file.fieldname === "fileCover") {
            cb(null, 'library/covers')
        }
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

module.exports = multer({storage, limits: {
    fileSize: 30 * 1024 * 1024, // 30MB
  }})