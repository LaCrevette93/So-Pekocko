const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req,res,next) => {
    const sauceObjet = JSON.parse(req.body.sauce);
    delete sauceObjet._id;
    const sauce = new Sauce({
        ...sauceObjet,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    if (!req.body.errorMessage) {
        sauce.save()
        .then(() => { 
            res.status(201).json({ message: 'La sauce a été créée avec succès!' }); 
        })
        .catch((error) => {
            if (error.message.indexOf("to be unique") > -1) {
                res.status(400).json({ message: "La sauce existe déjà!"});
                fs.unlink(`images/${req.file.filename}`, () => {
                    console.log("Image supprimée car la requête ne correspond pas aux informations attendues")
                });
            }
        res.status(500).json({message:error});
        })
    }
};

exports.allSauces = (req,res,next) => {
    Sauce.find()
    .then(sauces => {
        res.status(200).json(sauces);
    })
    .catch(error => {
        res.status(400).json({ message: error });
    });
};

exports.oneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        res.status(200).json(sauce);
    })
    .catch( error => {
        res.status(404).json({ error: error });
    });
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'La sauce a bien été supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
};

exports.modifyLikeSauce = (req, res, next) => {
    let message = "";
    const situation = req.body.like;
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        switch(situation){
            case 1:
                sauce.likes += 1;
                sauce.usersLiked.push(req.body.userId);
                message = "Vous aimez la sauce " + sauce.name + "!";
                break;
            case -1:
                sauce.dislikes += 1;
                sauce.usersDisliked.push(req.body.userId);
                message = "Vous n'aimez pas la sauce " + sauce.name + "!";
                break;
            case 0:
                sauce.usersLiked.forEach(user => {
                    if(user == req.body.userId) {
                        sauce.likes-=1;
                        sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId),1);
                    }
                });
                sauce.usersDisliked.forEach(user => {
                    if(user == req.body.userId) {
                        sauce.dislikes-=1;
                        sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId),1);
                    }
                });
                message = "Vous n'avez aucune préférences pour cette sauce: " + sauce.name + "!";
                break;
            default:
                message = "Impossible de déterminer l'action de l'utilisateur";
        }
        Sauce.updateOne({ _id: req.params.id },{$set: {
            likes: sauce.likes,
            dislikes: sauce.dislikes,
            usersDisliked: sauce.usersDisliked,
            usersLiked: sauce.usersLiked}})
            .then(() => res.status(200).json({ message}))
            .catch(error => res.status(400).json({ error: req.body.message }));
    })
    .catch(error => res.status(400).json({ error: "Une erreur est survenue lors de l'analyse des données!" }));
}

exports.modifySauce = (req, res, next) => {
    if (req.file) {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {});
            })
            .catch(error => res.status(500).json({ error }));
    }
    const sauceObject = req.file ?
        {    
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'La sauce a été modifiée!'}))
            .catch(error => res.status(400).json({ error }));
};