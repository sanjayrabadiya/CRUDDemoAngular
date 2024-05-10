const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'D:/Angular/angular-demo/crudDemo/src/assets/images');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), (req, res) => {
  res.send('Image uploaded successfully');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});