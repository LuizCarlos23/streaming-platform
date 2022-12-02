const jwt = require("jsonwebtoken")

const JWT_SECRET = String(process.env.JWT_SECRET)

module.exports = (req, res, next) => {
    let token
    if (req.headers['x-access-token'])
        token = req.headers['x-access-token'].replace("Bearer ", "");

    if(!token) return res.status(401).json({message: 'No token provided.'})

    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.status(401).json({message: "Unauthorized"})
        
        if (!decoded.id)
            return res.status(401).json({message: 'Invalid token'})

        req.UserID = decoded.id
        
        next();
    })
}