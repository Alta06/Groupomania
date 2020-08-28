const db = require('../db');
const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'SECRETKEY');
    const userId = decodedToken.userId;

db.query(
    `SELECT isAdmin FROM Members WHERE id = ?`, [userId],

    (error, result) => {
        if (error) {
            res.send({
                "code":400,
                "message":"Error"
            })
        } 
            if (result[0].isAdmin) {
                next();
            } else {
                res.send({
                    "code":401,
                    "message":"L'utilisateur n'est pas admin"
                })
        }
    }
)

}