require('dotenv').config();
const express = require('express');
const configViewEngine = require('./config/viewEngine');
const webRoutes = require('./routes/web');
const apiRoutes = require('./routes/api');
const configCors = require('./config/cors');
const connectDB = require('./config/connectDB');

const app = express();
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

// Cấu hình cors
configCors(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cấu hình template engine
configViewEngine(app);

// Khai báo route
app.use('/', webRoutes); //Tất cả những route khai báo sẽ nằm sau đường dẫn này
app.use('/api/v1/', apiRoutes);

// Kết nối CSDL
connectDB();

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`)
})
