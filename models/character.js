import mongoose from 'mongoose';

const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let Character = new Schema({
    hanzi: {
        type: String
    },
    pinyin: {
        type: String
    },
    definition: {
        type: String
    },
    frequency: {
        type: Number
    },
    state: {
        type: Number
    },
    HSKLevel: {
        type: Number
    },
    lastModifiedDate: {
        type: Date
    },
    comments: {
        type: [String]
    }

});

Character.pre("save", function (next) {
    let now = new Date();
    if (!this.lastModifiedDate) {
        this.lastModifiedDate = now;
    }
    next();
});

Character.pre("save", function (next) {
    let now = new Date();
    if (!this.comments[0]) {
        this.comments.push("Character generated on" + now)
    }
    next();
});

export default mongoose.model('Characters', Character, 'characters');