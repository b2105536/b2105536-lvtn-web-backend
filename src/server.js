const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

// Cấu hình template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

// Cấu hình static files: image/css/js
app.use(express.static(path.join(__dirname, 'public')));

// Khai báo route
app.get('/', (req, res) => {
  res.send('Hello World! & nodemon')
})

app.get('/abc', (req, res) => {
  // res.send('<h1> Hello ABC! </h1>')
  res.render('sample.ejs')
})

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`)
})
