var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var panelSchema = new Schema({
    created_by: { type: Schema.ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now },
    name: String,
    tasks: [
        { 
            created_by: { type: Schema.ObjectId, ref: 'User' },
            created_at: { type: Date, default: Date.now },
            modified_at: { type: Date, default: Date.now },
            title: String,
            details: String
        }
    ]
});

var userSchema = new Schema({
    username: String,
    password: String,
    created_at: { type: Date, default: Date.now }
});

mongoose.model('Panel', panelSchema);
mongoose.model('User', userSchema);