const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/need-signin.middleware');

//상품 등록

const { Product } = require('../models');
router.post('/', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const { userId } = res.locals; // 미들웨어에서 추출한 userId

  // 입력 데이터 검증
  if (!title || !content) {
    return res.status(400).json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
  }
  console.log(Product);
  const createdProducts = await Product.create({
    title,
    content,
    author: userId,
    status: 'FOR_SALE',
  });

  res.json({ products: createdProducts, message: '상품을 등록하였습니다.' });
});

//상품목록 조회 API
router.get('/', async (req, res) => {
  const products = await Product.findAll({ order: [['createdAt', 'DESC']] });
  res.status(200).json({ products });
});

//특정사용자가 등록한 상품 찾기
router.get('/user/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  const products = await Product.findAll({ where: { author: id } });
  res.status(200).json({ products });
});

//상품 상세 조회API(id로 조회하기)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOne({ where: { id } });
  if (!product) {
    return res.status(400).json({ errorMessage: '그런 상품 없음, 다른데서 찾으셈' });
  }

  res.status(200).json({ product });
});

//상품 정보 수정
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, content, status } = req.body;
  const { userId } = res.locals; // 미들웨어에서 추출한 userId

  const product = await Product.findOne({ where: { id } });
  if (!product) {
    return res.status(404).json({ errorMessage: '상품이 존재하지 않습니다.' });
  }

  if (userId !== Number(product.author)) {
    return res.status(403).json({ errorMessage: '권한이 없습니다.' });
  }

  await Product.update({ title, content, status }, { where: { id } });

  res.status(200).json({ success: true });
});

// 상품 삭제
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { userId } = res.locals;

  const product = await Product.findOne({ where: { id } });
  if (!product) {
    return res.status(404).json({ errorMessage: '상품이 존재하지 않습니다.' });
  }

  if (userId !== Number(product.author)) {
    return res.status(403).json({ errorMessage: '권한이 없습니다.' });
  }

  await Product.destroy({ where: { id } });
  res.status(200).json({ result: 'success', message: '상품을 삭제하였습니다.' });
});

module.exports = router;
