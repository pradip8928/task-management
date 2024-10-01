const { registerValidation, loginValidation } = require("../validation/userValidation.js")
const User = require("../models/userModel.js")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const gernerateToken = require("../utils/generateToken.js")

const registerUser = async(req, res) => {
    console.log(req.body);

    const { error } = registerValidation(req.body);
    if (error) {
        console.log(error.details);
        return res.status(400).send(error.details[0].message);
    }

    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send("email already exists");

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role || "user"
    })

    try {



        const savedUser = await user.save();

        const token = jwt.sign({
                _id: savedUser._id,
                role: savedUser.role
            },
            process.env.JWT_SECRET, { expiresIn: '1h' })


        res.header('auth-token', token).send({ token, user: savedUser });
    } catch (error) {
        res.status(400).send(error);
    }

}

const loginUser = async(req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email or Password is wrong");

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send("Password is incorrect");


    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" })
    res.header('auth-token', token).send({
        token,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })
}

const getAllUsers = async(req, res) => {
    try {

        const users = await User.find({}, '-__v');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to Fetch Users", error: error.message })
    }
}

const logoutUser = async(req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
    res.status(200).json({ success: true, message: "You Logout" });

}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getAllUsers
};