const jwt = require('jsonwebtoken');

const secret_key = 'sdfghgfdasdfghjhtrewqwertyuytrewqaxcvbhuytrewsxcvhytrewasxcvghytrewsxcvbhytrewsxcvghytrewazxcvgtrewazxcvghytrewasxcg';

exports.verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log("token:", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'A token is required for authentication',
            success: false
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, secret_key);
        req.user = decoded;
        next(); 
    } catch (err) {
        return res.status(401).json({
            message: 'Invalid Token',
            success: false
        });
    }
};
