const express = require('express');
const path = require('path');
const app = express();
const fileUpload = require('express-fileupload');

app.use(fileUpload());
app.use(express.json());

const memberRoute = require('./server/routes/member');
const postRoute = require('./server/routes/post');
const commentRoute = require('./server/routes/comment');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api', memberRoute);
app.use('/api', postRoute);
app.use('/api', commentRoute);


app.listen(process.env.PORT || '3000', () => {
    console.log(`Server is running on port: ${process.env.PORT || '3000'}`);
})

