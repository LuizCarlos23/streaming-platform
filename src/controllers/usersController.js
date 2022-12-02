const Yup = require("yup")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const HttpException = require("../exceptions/httpException")

const User = require("../models/users")

const TokenExpiresIn = Number(process.env.EXPIRES_IN)
const JWT_SECRET = String(process.env.JWT_SECRET)

const UserSchema =  {
    create: Yup.object().shape({
            username: Yup.string().min(3, "Minimum 3 characters required").required("Username is required"),
            email: Yup.string().email().required("Email is required"),
            password: Yup.string().min(8, "Minimum 8 characters required").required("Password is required"),
    }),
    login: Yup.object().shape({
            email: Yup.string().email().required("Email is required"),
            password: Yup.string().min(8, "Minimum 8 characters required").required("Password is required"),
    })
}

function generateToken(id){
    return jwt.sign({id}, JWT_SECRET, {
        expiresIn: TokenExpiresIn
    })
}


async function Create(req, res, next) {
    try {
        let userData = await UserSchema.create.validate(req.body, { stripUnknown: true }).catch(err => {
            throw new HttpException(400, err.message, err, err.path)
        })
        
        await User.findOne({
            where: { email: userData.email },
            raw: true,
            attributes: ["id"],
        })
        .catch(err => {
            throw new HttpException(500, "Internal error", err)
        })
        .then(result => {
            if (result != null) 
                throw new HttpException(409, "This email is already registered", null,"email")
        })
        

        userData.password = bcrypt.hashSync(userData.password, Number(process.env.PWD_SALT_ROUNDS))

        await User.create(userData, { raw: true, attributes: ["id"]})
            .then(result => {
                userData.id = result.dataValues.id
            })

        let token = generateToken(userData.id)

        return res.status(201).json({token})
    } catch (error) {
        return next(error)
    }
}

async function Login(req, res, next){
    try {
        let userData = await UserSchema.login.validate(req.body, { stripUnknown: true }).catch(err => {
            throw new HttpException(400, err.message, err, err.path)
        })
        

        let { password: userPwd, id: UserId }  = await User.findOne({
            where: { email: userData.email },
            attributes: ["password", "id"],
            raw: true
        })
        .then(result => {
            if (result == null) 
                throw new HttpException(400, "Invalid email or password", null)
            return result    
        })

        await bcrypt.compare(userData.password, userPwd)
            .catch(err => {
                throw new HttpException(400, "Invalid email or password", err)
            })
            .then(result => {
                if(!result)
                    throw new HttpException(400, "Invalid email or password") 
            })
    
        let token = generateToken(UserId)

        return res.status(200).json({token: token})
    } catch (error) {
        return next(error)
    }
}

module.exports = { Create, Login }