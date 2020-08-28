const db = require('../db');
const jwt = require('jsonwebtoken');
const fs = require('fs');


exports.createPost = (req, res, next) => {

    if (!req.files) {
        return res.status(500).send({
            msg: "file is not found"
        })
    }
    // accessing the file
    const myFile = req.files.file;
    const newName = Date.now() + '-' + myFile.name;

    //  mv() method places the file inside image directory
    myFile.mv(`images/${newName}`, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({
                msg: "Error occured"
            });
        }

    });

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'SECRETKEY');
    const userId = decodedToken.userId;
    const date = new Date().toLocaleString();
    const image = {
        imageUrl: `${req.protocol}://${req.get('host')}/images/${newName}`
    };

    db.query(

        `INSERT INTO Posts (userId, messages, date, url) VALUES (
            ${db.escape(userId)},
            ${db.escape(req.body.messages)},
            ${db.escape(date)},
            ${db.escape(image.imageUrl)}

        )`,

        (err, result) => {

            if (err || !req.body.messages) {

                return res.status(400).send({
                    msg: err
                });
            }

            return res.status(201).send({
                result
            });
        }
    )
}

exports.getAllPost = (req, res, next) => {
    db.query(

        `SELECT Posts.userId, Posts.id, messages, firstName,
         lastName, profilePic, likes, comments, url, date
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
            });
        }
    )
}

exports.likePost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'SECRETKEY');
    const userId = decodedToken.userId;

    db.query(
        `SELECT * FROM UsersLiked WHERE userId = ${db.escape(userId)} AND postLiked = ${db.escape(req.params.id)}`,
        (err, result) => {
            if (err) {
                return res.status(501).send({
                    msg: err
                });
            }
            res.status(201).send({
                result
            });
            if (result.length > 0) {
                db.query(
                    `DELETE FROM UsersLiked WHERE userId = ${db.escape(userId)} AND postLiked = ${db.escape(req.params.id)}`
                    
                ), db.query(
                    `UPDATE Posts
                    SET likes = likes - 1
                    WHERE ID = ${req.params.id}`
                ),
                (err, result) => {
                    if (err) {
                        return res.status(501).send({
                            msg: err
                        });
                    }
                    res.status(201).send({
                        result
                    });
                }
            } else {
                db.query(
                        `INSERT INTO UsersLiked (userId, postLiked) VALUES (
                            ${db.escape(userId)},
                            ${db.escape(req.params.id)}
                        )`),

                    db.query(
                        `UPDATE Posts
                             SET likes = likes + 1
                             WHERE ID = ${req.params.id}`
                    ),
                    (err, result) => {
                        if (err) {
                            return res.status(501).send({
                                msg: err
                            });
                        }
                        res.status(201).send({
                            result
                        });
                    }
            }
        }
    )
}

exports.getLikes = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'SECRETKEY');
    const userId = decodedToken.userId;
    db.query(
        `SELECT * FROM UsersLiked WHERE userId = ${db.escape(userId)}`,
        (err, result) => {
            if (err) {
                res.status(500).send({
                    msg: err
                });
            }
            res.status(200).send({
                msg: 'Voici la table UsersLiked',
                result
            });
        }
    )
}

exports.deletePost = (req, res, next) => {
   
    db.query(
        `SELECT url FROM Posts WHERE id = ${db.escape(req.params.id)}`,
        (err, result) => {
            if (err) {
                res.status(500).send({
                    msg: err
                })
            }
            
            let imageUrl = result[0].url;
            let fileName = imageUrl.split('/images/')[1];
            fs.unlink(`images/` + fileName, () => {})

        }
    ),

    db.query(
        `DELETE FROM Posts
        WHERE Posts.ID = ${db.escape(req.params.id)}`,
        
         (err, result) => {
            if (err) {
                res.status(500).send({
                    msg: err
                });
            }
            res.status(200).send({
                result
            });
        }
    )

}
