const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Save prediction
router.post('/', auth, async (req, res) => {
  const { tenth, twelfth, cgpa, result } = req.body;
  
  try {
    const prediction = await prisma.prediction.create({
      data: {
        tenth: parseFloat(tenth) || 0,
        twelfth: parseFloat(twelfth) || 0,
        cgpa: parseFloat(cgpa) || 0,
        result,
        user: {
          connect: { id: req.user.userId }
        }
      },
    });
    res.status(201).json(prediction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error saving prediction' });
  }
});

// Get user predictions
router.get('/', auth, async (req, res) => {
  try {
    const predictions = await prisma.prediction.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(predictions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching predictions' });
  }
});

module.exports = router;
