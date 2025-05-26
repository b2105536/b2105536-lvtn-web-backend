require('dotenv').config();
const express = require('express');
const configViewEngine = require('./config/viewEngine');
const webRoutes = require('./routes/web');

const app = express();
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

// Cấu hình template engine
configViewEngine(app);

// Khai báo route
app.use('/', webRoutes); //Tất cả những route khai báo sẽ nằm sau đường dẫn này

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`)
})
