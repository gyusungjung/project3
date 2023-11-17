require('dotenv').config();
const express = require('express');
const router = express.Router();
const app = express();
const usersRouter = require('./routers/users.router.js');
const productRouter = require('./routers/products.router.js');
const authRouter = require('./routers/auth.router.js');

const port = process.env.PORT; //const port = 3000;

//Sequelize connect
const { sequelize } = require('./models');
// 다른 require문은 일단 생략
const ConnectDB = async () => {
  try {
    await sequelize.authenticate().then(() => console.log('데이터베이스 연결 성공!'));
    await sequelize.sync().then(() => console.log('동기화 완료!'));
  } catch (error) {
    console.error('DB 연결 및 동기화 실패', error);
  }
};
// DB와 연결 및 동기화
ConnectDB();

app.use(express.json());

app.use('/users', usersRouter);
app.use('/products', productRouter);

app.get('/', (req, res) => {
  res.send('hello');
});

app.listen(port, () => {
  console.log(port, '번호로 연결되었습니다.');
});
