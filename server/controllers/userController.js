const {Todo, User} = require('../models/index')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.googleClient);
const Bcrypt = require('../helper/bcrypt')
const jwt = require('jsonwebtoken');
class UserController{
    static register(req, res, next){
        const obj = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        }
        User.create(obj)
        .then(value => {
            res.status(200).json({name: value.name, email: value.email})
        })
        .catch(error => {
            next(error)
        })
    }
    static login(req, res, next){
        const email = req.body.email
        const password = req.body.password
        console.log(email);
        User.findOne({where:{
            email: email
        }})
        .then(value => {
            if (!value) {
                throw {
                    status: 401,
                    message: `invalid account`
                }
            }else if(Bcrypt.compare(password, value.password)){
                const token = jwt.sign({id: value.id, email:value.email}, process.env.secret)
                res.status(200).json(token)
            }else{
                throw {
                    status: 401,
                    message: `email or password invalid`
                }
            }
        })
        .catch(error => {
           next(error)
        })
    }
    static async googleLogin(req, res, next){
        try {
            const ticket = await client.verifyIdToken({
                idToken: req.body.googleToken,
                audience: process.env.googleClient, 
            });
            const payload = ticket.getPayload()
            const findUser = await User.findOne({
                where: {
                    email : payload.email
                }
            }) 
            if (findUser) {
                const token = jwt.sign({id: findUser.id, email:findUser.email}, process.env.secret)
                res.status(200).json(token)
            }else{
                const createUser = await User.create({
                    name: payload.email.split('@')[0],
                    email : payload.email,
                    password: process.env.secretPassword
                })
                const token = jwt.sign({id: createUser.id, email:createUser.email}, process.env.secret)
                res.status(200).json(token)
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController