const db = require('../db');
const jwt = require('jsonwebtoken');

exports.commentPost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, `${process.env.sktdt}`);
    const userId = decodedToken.userId;
    const date = new Date().toLocaleString();


    db.query(
            `INSERT INTO Comments (userId, message, postId, date) VALUES (
            ?, ?, ?, ?)`, [userId, req.body.message, req.body.postId, date]
        ),

        db.query(
            ` UPDATE Posts 
        SET comments = comments + 1

        WHERE id = ?`, [req.body.postId],

            (err, result) => {
                if (err) {
                     res.send({
                         "code": 400,
                         "message": err
                    });
                }
                 res.send({
                     "code": 201,
                     "message": 'Post commenté et nombre de comm incrémenté de 1 !!',
                    result
                })
            }
        )
}

exports.getAllComments = (req, res, next) => {
    db.query(
        `SELECT Comments.id, message, Comments.userId, firstName, lastName, profilePic, postId, date
        FROM Comments
        INNER JOIN Members
        ON Comments.userId = Members.id
        ORDER BY Comments.id DESC
      `,
        (err, result) => {
            if (err) {
                return res.send({
                    "code": 400,
                    "message": err
                });
            }
            return res.send({
                "code": 200,
                "message": 'Voila les commentaires',
                result

            })
        }
    )
}

exports.deleteComment = (req, res, next) => {
    db.query(
            `DELETE FROM Comments WHERE id= ?`, [req.params.commentId],

            (err, result) => {
                if (err) {
                    res.send({
                        "code": 400,
                        "message": err
                    });
                }

                res.send({
                    "code": 201,
                    result
                })
            }
        )

        db.query(
            `Update Posts 
        SET comments = comments - 1
        
        WHERE id = ?`, [req.params.postId]
        ),
        (err, result) => {
            if (err) {
                res.send({
                    "code": 400,
                    "message": err
                });
            }

            res.send({
                "code": 200,
                "message": 'Commentaire supprimé',
                result

            })
        }
}