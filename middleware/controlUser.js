module.exports = (req,res,next) => {
    const regexPassword = /^(?=.*[A-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@!%*$.?])\S{8,15}$/;
    const pattern = new RegExp(regexPassword);
    if(pattern.test(req.body.password)) {
        next();
    } else {
        res.status(400).json({ message: "Le mot de passe doit comporter entre 8 et 15 caractères, "
            +"posséder au moins un chiffre, une lettre majuscule et minuscule et l'un des caractères spéciaux suivants: @$!%*?&."});
    }
}