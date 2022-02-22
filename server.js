var express = require('express');
var path = require('path');
var app = express();
var multer = require('multer')
var cors = require('cors');

app.use(cors())

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/logs');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

var upload = multer({storage: storage}).single('file');

app.post('/upload',function(req, res) {
     
    upload(req, res, function (err) {
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
      return res.status(200).send(req.file)

    })

});

app.get('/logs', (req, res) => {
    return res.sendFile(path.join(__dirname, 'public/logs', 'TestData.csv'))
});

app.listen(8000, function() {
    console.log('Running on port 8000');
})