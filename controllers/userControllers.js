const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const signUp = async (req, res) => {
    try {
        const { name, password } = req.body
        const encryptedPassword = await bcrypt.hash(password, 10);
        const isUserExists = await User.findOne({ name: name })

        if (isUserExists) {
            res.status(400).send('User already exists, please login')
        } else {
            if (password.length >= 5) {
                const user = new User({ name, password: encryptedPassword })
                await user.save()
                res.status(201).send(`user ${name} created successfully`)
            } else {
                res.status(400).send('Password shoud be equal or greater than 5 characters')
            }
        }

    } catch (error) {
        console.log("Error", error)
        res.status(500).json({ message: 'Server Error' })
    }
}

const login = async (req, res) => {
    const secretToken = process.env.SECRET_TOKEN
    try {
        const { name, password } = req.body
        const isUserExists = await User.findOne({ name })
        if (!isUserExists) return res.status(401).send('User not found, check user name or sign up')

        const checkPassword = await bcrypt.compare(password, isUserExists.password);

        if (!checkPassword) return res.status(400).send("Invalid password");

        const payload = { userName: name }

        const jwtToken = jwt.sign(payload, secretToken)
        res.status(200).json({ token: jwtToken });

    } catch (error) {
        console.log("Error", error)
        res.status(500).json({ message: 'Server Error' })
    }

}

const getUser = async (req, res) => {
    try {
        const { user } = req
        res.status(200).send(user)
    } catch (error) {
        console.log("Error", error)
        res.status(500).json({ message: 'Server Error' })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).send(users)
    } catch (error) {
        console.log("Error", error)
        res.status(500).json({ message: 'Server Error' })
    }
}

module.exports = { signUp, login, getUser, getAllUsers }