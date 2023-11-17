const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  const [authType, authToken] = (authorization || '').split(' ');

  if (!authToken || authType !== 'Bearer') {
    res.status(401).send({
      errorMessage: '로그인 후 이용 가능한 기능입니다.',
    });
    return;
  }

  try {
    const { userId } = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET);
    res.locals.userId = userId;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send({
      errorMessage: '토큰 검증에 실패하였습니다.',
    });
  }
};

//토큰 만료, 토큰 검증안된거 오류 추가 try { ... } catch (error) { if (error instanceof TokenExpiredError) { ... } else if (error instanceof JsonWebTokenError) { ... } else { console.error(error); } }
