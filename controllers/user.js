const bcrypt = require('bcrypt');
const token = require('jsonwebtoken');
const maskEmail = require('nodejs-base64-encode');
const User = require('../models/user');

exports.signup = (req,res,next) => { 
    bcrypt.hash(req.body.password,10)
    .then(hash => {
        const user = new User ({
            email: maskEmail.encode(req.body.email, 'base64'),
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({message: "Votre compte a bien été enregistré!"}))
        .catch(error => {
            if (error.message.indexOf("to be unique") > -1) {
                res.status(400).json({ message: "Une erreur s'est produite dû a des informations saisies incorrectes!"});
            } else {
                res.status(400).json({message:error});
            }
        })
    })
    .catch(error => res.status(500).json({message:error}));
};

exports.login = (req,res,next) => {
    User.findOne({email: maskEmail.encode(req.body.email, 'base64')})
    .then(user => {
        if(!user) {
            return res.status(401).json({message:"Une erreur s'est produite dû a des informations saisies incorrectes!"});
        }
        bcrypt.compare(req.body.password,user.password)
        .then(valid => {
            if(!valid) {
                return res.status(401).json({message:"Authentification incorrecte!"})
            }
            return res.status(200).json({
                userId: user._id,
                token: token.sign(
                    { userId: user._id },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '1h' }
                )
            });
        })
        .catch(error => res.status(500).json({message:"Une erreur est survenue: "+error}));
    })
    .catch(error => res.status(500).json({message:"Cette adresse est introuvable en base de données: "+error}));  
};