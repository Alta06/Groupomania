const db = require('../db');
const jwt = require('jsonwebtoken');


exports.createPost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'SECRETKEY');
    const userId = decodedToken.userId;
    const date = new Date().toLocaleString();

    db.query(
        
        `INSERT INTO Posts (userId, messages, date) VALUES (
            ${db.escape(userId)},
            ${db.escape(req.body.messages)},
            ${db.escape(date)}

        )`,
        (err, result) => {

            if (err || !req.body.messages) {
                
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

        `SELECT messages, firstName, lastName, date, likes, comments, shares
        FROM Posts 
        INNER JOIN Members 
        ON userId = Members.id 
        ORDER BY Posts.date DESC`,
        
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
}

exports.likePost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'SECRETKEY');
    const userId = decodedToken.userId;

    db.query(
        `INSERT INTO Posts (usersLiked, likes) VALUES (
            ${db.escape(userId)},
            ${db.escape(+1)}
        )`,

        (err, result) => {
            if (err) {
                return res.status(400).send({
                    msg: err
                });
            }
            return res.status(201).send({
                msg: 'Post liké !!',
                result
            })
        }
    )
}
