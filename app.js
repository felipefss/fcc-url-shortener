const express = require('express');
const Mongo = require('mongodb').MongoClient;
const isUrl = require('validator/lib/isURL');
const shortUrl = require('./shortURL');

const app = express();
const PORT = process.env.PORT || 5000;
// const mongoUri = process.env.MONGODB_URI;
const mongoUri = 'mongodb://localhost:27017/mydb';

const encodeUrl = fullUrl => {
    return new Promise((resolve, reject) => {
        Mongo.connect(mongoUri, (err, db) => {
            if (err) {
                reject(err);
            }
            const collection = db.collection('short_urls');
            collection.count().then(count => {
                const id = count + 1;
                const newItem = {
                    _id: id,
                    originalUrl: fullUrl
                };

                collection.insertOne(newItem)
                    .then(() => {
                        db.close();
                        resolve(shortUrl.encode(id));
                    })
                    .catch(err => {
                        db.close();
                        reject(err);
                    });
            }).catch(err => {
                db.close();
                reject(err);
            });
        });
    });
};

app.use(express.static('public'));

app.get('/:short', (req, res) => {

});

app.get('/new/*', (req, res) => {
    const reqUrl = req.params['0'];
    const errorObj = {
        error: {
            URL: reqUrl
        }
    };

    if (isUrl(reqUrl)) {
        encodeUrl(reqUrl)
            .then(encodedUrl => {
                const resObj = {
                    original_url: reqUrl,
                    short_url: `https://rocky-caverns-49207.herokuapp.com/${encodedUrl}`
                };
                res.send(resObj);
            })
            .catch(err => {
                errorObj.error.reason = '' + err;
                res.send(errorObj);
            });
    } else {
        errorObj.error.reason = 'Invalid URL';
        res.send(errorObj);
    }
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
