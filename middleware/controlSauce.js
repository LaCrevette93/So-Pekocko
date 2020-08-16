const fs = require('fs');

const expRegex = {
    name: "^[^\\s][a-zA-Zéèàêûçàôë\\s-]{2,40}$",
    manufacturer: "^[^\\s][a-zA-Zéèàêûçàôë'\\s-]{2,25}$",
    description: "^[^\\s][a-zA-Zéèàêûçàôëî.':,!\\s-]{10,1000}$",
    mainPepper: "^[^\\s][a-zA-Zéèàêûçàôë',\\s-]{2,45}$",
    };

module.exports = (req,res,next) => {
    let error = "";
    let error400 = false;
    if (req.body.sauce) {
        sauceObject = JSON.parse(req.body.sauce);
    } else {
        sauceObject = {...req.body};
    }
    for (let key in expRegex) {
        const pattern = new RegExp(expRegex[key]);
        if (pattern.test(sauceObject[key]) == false) {
            error += " " + key + " ";
            error400 = true;
        }
    }
    if (error400 == true || req.body.errorMessage) {
        res.status(400).json({ message: "Un problème est survenu sur le(s) champ(s) suivant(s)" + error + " " + req.body.errorMessage + "!"});
        fs.unlink(`images/${req.file.filename}`, () => {
            console.log("Image supprimée car la requête ne correspond pas aux informations attendues")
        });
    }
    else {
        next();
    }
}