
import Character from '../models/character'

import mongoose from 'mongoose';
mongoose.connect('mongodb://localhost:27017/hanzimanager')

// var Word = mongoose.model('Word');
mongoose.set("debug", true);

module.exports.addLastModifiedDate = function () {
    console.log("in the function")
    var conditions = { lastModifiedDate: '' }
        , update = {
            lastModifiedDate: Date.now()
        }
        , options = { multi: true };

    Character.update(conditions, update, options, ((err, res) => {
        if (err) console.log(err)
        else console.log(res)
    }

    ));
}


