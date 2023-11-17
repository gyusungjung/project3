const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// 기존의 코드

//비밀번호 암호화
const bcrypt = require('bcryptjs');

////////회원가입API

const { Op } = require('sequelize');
const { User } = require('../models');

router.post('/', async (req, res) => {
  const { email, nickname, password, confirmPassword } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  let regEmail = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
  let pwRef = /^[a-zA-z0-9]{6,12}$/;

  if (password !== confirmPassword) {
    res.status(400).send({
      errorMessage: '패스워드가 패스워드 확인란과 다릅니다.',
    });
    return;
  }

  // email or nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
  const existsUsers = await User.findAll({
    where: {
      [Op.or]: [{ email }, { nickname }],
    },
  });

  if (!regEmail.test(email)) {
    res.status(400).send({ errorMessage: 'Email 형식이 이상해요.' });
    return;
  }

  if (!pwRef.test(password)) {
    res.status(400).send({ errorMessage: 'Password 형식이 이상해요.' });
    return;
  }

  if (existsUsers.length) {
    res.status(400).send({
      errorMessage: '이메일 또는 닉네임이 이미 사용중입니다.',
    });
    return;
  }

  await User.create({ email, nickname, password: hash }).then((user) => {
    // password를 hash로 변경
    res.status(201).send(user);
  });
});

//로그인API
router.post('/auth', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email,
    },
  });

  // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
  if (!user || !bcrypt.compareSync(password, user.password)) {
    res.status(400).send({
      errorMessage: '이메일 또는 패스워드가 틀렸습니다.',
    });
    return;
  }

  const token = jwt.sign({ userId: user.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

  console.log('Generated Token: ', 'Bearer ', token); // 토큰을 콘솔에 출력

  res
    .header({
      token: token,
    })
    .send();
});

//모든유저 가져오기

router.get('/', async (req, res) => {
  const users = await User.findAll(); // 모든 사용자 정보를 가져옵니다.

  res.send({ users }); // 가져온 사용자 정보를 응답에 포함시킵니다.
});

//내정보조회 API

const authMiddleware = require('../middleware/need-signin.middleware');

router.get('/me', authMiddleware, async (req, res) => {
  const { userId } = res.locals;
  const user = await User.findOne({ where: { userId } });
  if (!user) {
    res.status(400).send({
      errorMessage: '사용자 정보가 없습니다.',
    });
    return;
  }

  res.send({
    user: {
      email: user.email,
      nickname: user.nickname,
    },
  });
});

module.exports = router;
