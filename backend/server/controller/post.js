const db = require('../db');
const jwt = require('jsonwebtoken');

exports.createPost = (req, res, next) => {


    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
        // accessing the file
    const myFile = req.files.file;
    const newName = Date.now() + '-' + myFile.name;

    //  mv() method places the file inside image directory
    myFile.mv(`images/${newName}`, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ msg: "Error occured" });
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
                msg: 'Post enregistré !!'
            })
        }
    )
}

exports.getAllPost = (req, res, next) => {  
    db.query(

        `SELECT messages, firstName, lastName, date, likes, comments, shares, url
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