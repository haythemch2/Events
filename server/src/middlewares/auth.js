const jwt = require('jsonwebtoken');
const User = require('../models/user');

const simple = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'mySecret');
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });
    if (!user) throw new Error();
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

const enhance = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'mySecret');
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });
    if (!user || user.role !== 'superadmin') throw new Error();
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.log(e.message);
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = { simple, enhance };
