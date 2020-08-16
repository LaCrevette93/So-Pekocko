const token = require('jsonwebtoken');

module.exports = (req,res,next) => {
    try { 
        const reqtoken = req.headers.authorization.split(" ")[1];
        const decodedToken = token.verify(reqtoken,'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        if(req.body.userId&&req.body.userId!==userId) {
            throw "Non authentifié!";
        } else {
            next();
        }
    } catch {
        res.status(401).json({error: 'Token expiré!'});
    }
}