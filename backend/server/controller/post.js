const db = require('../db');
const jwt = require('jsonwebtoken');


exports.createPost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'SECRETKEY');
    const userId = decodedToken.userId;
    const date = new Date().toLocaleString();

    db.query(
        
        `INSERT INTO Posts (userId, comments, date) VALUES (
            ${db.escape(userId)},
            ${db.escape(req.body.message)},
            ${db.escape(date)}

        )`,
        (err, result) => {

            if (err) {
                
                return res.status(400).send({
                    msg: err
                });
            }
            return res.status(201).send({
                msg: 'Post enregistré !!' 
            })
        }
    )
}

exports.getAllPost = (req, res, next) => { 
    db.query(

        `SELECT * FROM Posts ORDER BY date DESC`, 
        (
            (err, result) => {
                if (err) {
                    return res.status(400).send({
                        msg: err
                    });
                }
                return res.status(200).send({
                    msg: 'Voila !!',
                    result
                })
            }
        )
    )
}
