const db = require('../db');
const jwt = require('jsonwebtoken');

exports.commentPost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'SECRETKEY');
    const userId = decodedToken.userId;

    db.query(
            `INSERT INTO Comments (userId, message, postId) VALUES (
            ${db.escape(userId)},
            ${db.escape(req.body.message)},
            ${db.escape(req.body.postId)})
        `
        ),
        

        db.query(
            ` UPDATE Posts 
        SET comments = comments + 1

        WHERE id = ${db.escape(req.body.postId)}
`,
            (err, result) => {
                if (err) {
                    return res.status(400).send({
                        msg: err
                    });
                }
                return res.status(201).send({
                    msg: 'Post commenté et nombre de comm incrémenté de 1 !!',
                    result
                })
            }
        )
}

exports.getAllComments = (req, res, next) => {
    db.query(
        `SELECT Comments.id, message, Comments.userId, firstName, lastName, profilePic, postId
        FROM Comments
        INNER JOIN Members
        ON Comments.userId = Members.id
        ORDER BY Comments.id DESC
      `,
        (err, result) => {
            if (err) {
                return res.status(400).send({
                    msg: err
                });
            }
            return res.status(201).send({
                msg: 'Voila les commentaires',
                result

            })
        }

    )
}

exports.deleteComment = (req, res, next) => {
    db.query(
        `DELETE FROM Comments WHERE id= ${db.escape(req.params.commentId)}`,

        (err, result) => {
            if (err) {
                 res.status(400).send({
                    msg: err
                });
            }
            
             res.status(201).send({
                result

            })
        }
    ),

    db.query(
        `Update Posts 
        SET comments = comments - 1
        
        WHERE id = ${db.escape(req.params.postId)}`
    ),
    (err, result) => {
        if (err) {
             res.status(400).send({
                msg: err
            });
        }
        
         res.status(201).send({
            msg: 'Commentaire supprimé',
            result

        })
    }
}