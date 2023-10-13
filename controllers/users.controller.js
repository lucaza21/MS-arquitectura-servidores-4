//import model
const User = require("../models/user.model");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")

module.exports.create = (req, res) => {
    //console.log(req.body)
    bcrypt.hash(req.body.password, 10).then((hash) =>{
        req.body.password = hash;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'usert3p@gmail.com',
              pass: 'whhg zfhu hxbu pxps'
            }
          });
          transporter.sendMail({
            from: 'usert3p@gmail.com',
            to: req.body.email, 
            subject: "confirma tu cuenta", 
            text: `favor confirmar tu cuenta dando click en: http://localhost:8000/api/users/confirm/${req.body.email}`
,
            //html: `<b>${message}</b>`
          })
          .then(info => {
            
                User.create(req.body)
                .then((user) =>{
                    return res.status(201).json( {user:user, info:`http://localhost:8000/api/users/confirm/${req.body.email}`
} );
                })
                .catch((error) =>{
                    return res.status(400).json({ message: `Error creating user: ${error}`});
                }) 
          })
          .catch(error => console.log(error));
    })  
};

module.exports.confirm = (req, res) => {
    //console.log(req.body)
    const email = req.params.email 
    User.findOneAndUpdate( {email: email}, {active:true}, {returnOriginal: false} ).then(user => {
        if(user){
            console.log(user)
            res.json({ message: "Su email ha sido confirmado" });
        } else {
            res.status(401).json({ message: "Unauthorized"})
        }
    })
};

module.exports.login = (req, res) => {
    //console.log(req.body)
    User.findOne({
        email: req.body.email,
    }).then(user => {
        if(user?.active == true){
            bcrypt.compare(req.body.password, user.password).then(match => {
                if(match){
                    const token = jwt.sign(
                        {sub:user._id, exp: Date.now() / 1000 +3600},
                        "super-secret21"
                    );

                    res.json({ token:token });
                } else {
                    res.status(400).json({ message: "Error validación de datos" })
                }
            });
        } else {
            res.status(401).json({ message: "Unauthorized"})
        }
    })
};

module.exports.list = (req, res) => {
    User.find()
        .then((posts)=>{
            return res.status(200).json(posts);
        })
        .catch((error) =>{
            return res.status(400).json({ message: `Error listing post: ${error}`});
        }) 
};


module.exports.detail = (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then((post)=>{
            if(post){
                return res.status(200).json(post);
            } else{
                return res.status(404).json({message: "User doesnt exist"});
            }
        })
        .catch((error) =>{
            return res.status(400).json({ message: `Error listing post: ${error}`});
        })
}

module.exports.update = (req, res) => {
    const id = req.params.id;
    const body = req.body;
    User.findByIdAndUpdate(id, body,{
        new: true,
        runValidators: true
    })
        .then((post)=>{
            if(post){
                return res.status(200).json(post);
            } else{
                return res.status(404).json({message: "User doesnt exist"});
            }
        })
        .catch((error) =>{
            return res.status(400).json({ message: `Error updating post: ${error}`});
        })
}

module.exports.delete= (req, res) => {
    const id = req.params.id;
    User.findByIdAndDelete(id)
        .then((post)=>{
            if(post){
                return res.status(204).json();
            } else{
                return res.status(404).json({message: "User doesnt exist"});
            }
        })
        .catch((error) =>{
            return res.status(400).json({ message: `Error listing post: ${error}`});
        })
}

//-------------------------------------------------------------------------------------------
module.exports.filter = (req, res) => {

    const criteria = {};
    const filter = req.query.author;
    if(filter){
        criteria.author = new RegExp(req.query.author, "i");
    }
    User.find(criteria)
        .then((posts)=>{
            if(posts.length > 0){
                return res.status(200).json(posts);
            } else{
                return res.status(404).json({message: "Author doesnt exist"});
            }
        })
        .catch((error) =>{
            return res.status(400).json({ message: `Error listing post: ${error}`});
        })
};