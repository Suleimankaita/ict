const jwt = require('jsonwebtoken');
const { TokenExpiredError } = jwt;
const refreshTokens = []; // This should be replaced with a proper storage mechanism

const refresh = (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.sendStatus(401);
  }
  if (!refreshTokens.includes(token)) {
    return res.sendStatus(403);
  }
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    const accessToken = jwt.sign({ name: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    res.json(accessToken );
  });
};

module.exports = refresh;
