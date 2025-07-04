require('dotenv').config();
const express = require('express');
const configViewEngine = require('./config/viewEngine');
const webRoutes = require('./routes/web');
const connectDB = require('./config/connectDB');

const app = express();
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

// Add headers before the routes are defined
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', process.env.REACT_URL);

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cấu hình template engine
configViewEngine(app);

// Khai báo route
app.use('/', webRoutes); //Tất cả những route khai báo sẽ nằm sau đường dẫn này

// Kết nối CSDL
connectDB();

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`)
})
