require('dotenv').config();
const express = require('express');
const configViewEngine = require('./config/viewEngine');
const webRoutes = require('./routes/web');
const apiRoutes = require('./routes/api');
const configCors = require('./config/cors');
const connectDB = require('./config/connectDB');
const { createJWT, verifyToken } = require('./middleware/JWTAction');

const app = express();
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

// Cấu hình cors
configCors(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cấu hình template engine
configViewEngine(app);

// Test JWT
createJWT();
let decodedData = verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQ2jGsMahbmciLCJhZGRyZXNzIjoiQ-G6p24gVGjGoSIsImlhdCI6MTc1MjE3MDE3OX0.BAFMvj7ozRXQtp4xTgyZ8LnNi5jCye_KLUFv5-LnwQQ");
console.log(decodedData);

// Khai báo route
app.use('/', webRoutes); //Tất cả những route khai báo sẽ nằm sau đường dẫn này
app.use('/api/v1/', apiRoutes);

// Kết nối CSDL
connectDB();

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`)
})
