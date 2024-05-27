const jwt = require('jsonwebtoken')

const authenticateToken = async (req, res, next) => {
    const secretToken = process.env.SECRET_TOKEN
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).send('Authorization header missing');
        }

        const jwtToken = authHeader.split(' ')[1];
        jwt.verify(jwtToken, secretToken, async (error, payload) => {
            if (error) {
                return res.status(401).send('Invalid access token');
            }

            req.user = payload;
            next()
        });
    } catch (error) {
        console.log("Error", error)
        res.status(500).json({ message: 'Server Error' })
    }
}

module.exports = authenticateToken