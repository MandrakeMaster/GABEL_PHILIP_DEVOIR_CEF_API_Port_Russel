const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const User = new Schema({
    username: {
        type    : String,
        trim    : true,
        required: [true, 'Le nom est requis']
    },
    email: {
        type     : String,
        trim     : true,
        required : [true, 'L\'email est requis'],
        unique   : true,
        lowercase: true
    },
    password: {
        type     : String,
        required : [true, 'Le mot de passe est requis'],
        minlength: [8, 'Le mot de passe doit faire au moins 8 caractères'] 
    }
    }, {
        timestamps: true
});

//Hash le mot de passe quand il est modifié
User.pre('save', function(next) {
    if (!this.isModified('password')) {
        return typeof next === 'function' ? next() : null;
    }

    try {
        this.password = bcrypt.hashSync(this.password, 10);
        // Si next est une fonction, on l'appelle, sinon on termine simplement
        typeof next === 'function' ? next() : null;
    } catch (error) {
        typeof next === 'function' ? next(error) : null;
    }
});


module.exports = mongoose.model('User', User);
