const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {


    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).send('Access Denied: No token provided.');

    const token = authHeader.split(' ')[1]; // 'Bearer <token>'
    if (!token) return res.status(401).send("Access-Denied");


    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send("Invalid Token")
    }
}

module.exports = verifyToken;