import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import Character from './models/character'


const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());
var dbURI = 'mongodb://localhost:27017/hanzimanager'
if (process.env.NODE_ENV === 'production') {
    dbURI = 'mongodb://heroku_sb57b654:85h0chk24hoi6quj2am6ducqr0@ds135233.mlab.com:35233/heroku_sb57b654'
}

console.log("this is dbURI..." + dbURI)

mongoose.connect(dbURI); //TODO to change when mongodb is installed

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
})

router.route('/characters').get((req, res) => {
    Character.find((err, characters) => {
        if (err)
            console.log(err);
        else
            res.json(characters);
    })
});

router.route('/characters/:id').get((req, res) => {
    Character.findById(req.params.id, (err, character) => {
        if (err)
            console.log(err);
        else
            res.json(character);
    })
});

router.route('/characters/search/hanzi/:searchstring').get((req, res) => {
    Character.findOne({ hanzi: req.params.searchstring }, (err, character) => {
        if (err)
            console.log(err);
        else
            res.json(character);
    })
});

router.route('/characters/update/:id').post((req, res) => {
    Character.findById(req.params.id, (err, character) => {
        if (!character) {
            return next(new Error('Could not load documents'));
        }
        else {
            character.lastModifiedDate = req.body.lastModifiedDate;
            character.comments.push(req.body.comment)
            character.state = req.body.state

            character.save().then(character => {
                res.json(200, 'Update done')
            }).catch(err => {
                res.status(400).send('Update failed');
            })
        }
    })
});

router.route('/characters/:id/comments/delete/:index').post((req, res) => {
    Character.findById(req.params.id, (err, character) => {
        if (!character) {
            return next(new Error('Could not find document'));
        }
        else {
            character.comments.splice(req.params.index, 1);
            character.save().then(character => {
                res.json(200, 'Update done')
            }).catch(err => {
                res.status(400).send('Remove failed');
            })
        }
    })
});

app.use('/', router);

let port = process.env.PORT;
if (port == null || port == "") {
    port = 4000;
}

app.listen(port, () => {
    console.log('Express server running on port ' + process.env.PORT)
    console.log(process.env.NODE_ENV);
});

