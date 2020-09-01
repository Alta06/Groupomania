const db = require('../db');
const jwt = require('jsonwebtoken');
const fs = require('fs');


exports.createPost = (req, res, next) => {

    if (!req.files) {
        res.send({
            "code": 500,
            "message": "Aucun fichier trouvé"
        })
    }
    const myFile = req.files.file;
    const newName = Date.now() + '-' + myFile.name;

    myFile.mv(`images/${newName}`, (err) => {
        if (err) {
            return res.send({
                "code": 500,
                "message": err
            });
        }
    });

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, `${process.env.sktdt}`);
    const userId = decodedToken.userId;
    const date = new Date().toLocaleString();
    const image = {
        imageUrl: `${req.protocol}://${req.get('host')}/images/${newName}`
    };

    db.query(
        `INSERT INTO Posts (userId, messages, date, url) VALUES (
            ?,?,?,?)`, [userId, req.body.messages, date, image.imageUrl],

        (err, result) => {

            if (err || !req.body.messages) {

                return res.send({
                    "code": 400,
                    "message": err
                });
            }

            return res.send({
                "code": 201,
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
                return res.send({
                    "code": 401,
                    "message": err
                });
            }
            return res.send({
                "code": 200,
                "message": 'Voila les posts',
                result
            });
        }
    )
}

exports.likePost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, `${process.env.sktdt}`);
    const userId = decodedToken.userId;

    db.query(
        `SELECT * FROM UsersLiked WHERE userId = ? AND postLiked = ?`, [userId, req.params.id],
        (err, result) => {

            if (err) {
                return res.send({
                    "code": 400,
                    "message": err
                });
            }

            res.send({
                "code": 201,
                result
            });
            //Si un résultat est trouvé, l'utilisateur aime déjà le post
            if (result.length > 0) {
                db.query(
                        `DELETE FROM UsersLiked WHERE userId = ? AND postLiked = ?`, [userId, req.params.id],

                    ), db.query(
                        `UPDATE Posts
                    SET likes = likes - 1
                    WHERE ID = ?`, [req.params.id],
                    ),

                    (err, result) => {
                        if (err) {
                            return res.send({
                                "code": 400,
                                "message": err
                            });
                        }

                        res.send({
                            "code": 201,
                            result
                        });
                    }
            } else {
                db.query(
                        `INSERT INTO UsersLiked (userId, postLiked) VALUES (
                            ?, ?)`, [userId, req.params.id]
                    ),

                    db.query(
                        `UPDATE Posts
                             SET likes = likes + 1
                             WHERE ID = ?`, [req.params.id]
                    ),
                    (err, result) => {
                        if (err) {
                            return res.send({
                                "code": 400,
                                "message": err
                            });
                        }
                        res.send({
                            "code": 201,
                            result
                        });
                    }
            }
        }
    )
}

exports.getLikes = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, `${process.env.sktdt}`);
    const userId = decodedToken.userId;

    db.query(
        `SELECT * FROM UsersLiked WHERE userId = ?`, [userId],

        (err, result) => {
            if (err) {
                res.send({
                    "code": 401,
                    "message": err
                });
            }

            res.send({
                "code": 200,
                "message": 'Voici la table UsersLiked',
                result
            });
        }
    )
}

exports.deletePost = (req, res, next) => {

    //On récupère l'url de l'image pour la supprimer du dossier
    db.query(
            `SELECT url FROM Posts WHERE id = ?`, [req.params.id],

            (err, result) => {
                if (err) {
                    res.send({
                        "code": 401,
                        "message": err
                    })
                }

                let imageUrl = result[0].url;
                let fileName = imageUrl.split('/images/')[1];
                fs.unlink(`images/` + fileName, () => {})
            }
        )

        db.query(
            `DELETE p, c, u
         FROM Posts AS p
         LEFT JOIN Comments AS c
         ON c.postId = p.ID 
         LEFT JOIN usersLiked AS u
         ON u.postLiked = p.ID 
     
        WHERE p.ID = ?`, [req.params.id],

            (err, result) => {
                if (err) {
                    res.send({
                        "code": 401,
                        "message": err
                    });
                }
                res.send({
                    "code": 200,
                    result
                });
            }
        )

}