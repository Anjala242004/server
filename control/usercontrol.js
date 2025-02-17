const usermodel=require('../model/usermodel');
const bcrypt = require('bcrypt');
const {createToken}=require('../middleware/token')
//login user
const loginUser= async (req, res) => {
    const { email, password } = req.body;

    let user = await usermodel.find({ email: email });
    let password_db;
    if (user.length > 0) {
        password_db = user[0].password;
        const result = await bcrypt.compare(password, password_db);
        if (result) {
            let token = await createToken(user);
            res.json({ status: 1, msg: "Login success", 'userId': user[0]._id, 'token': token,'user': user[0] });
        } else {
            res.json({ status: 0, msg: "Password incorrect" });
        }
    } else {
        res.json({ status: 0, msg: "User not found" });
    }
};


//register user
const registerUser =  async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name|| !email || !password) {
            return res.status(400).json({ status: 0, msg: 'All fields are required' });
        }

        const existingUser = await usermodel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ status: 0, msg: 'Email already exists' });
        }

        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new usermodel({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        return res.status(201).json({ status: 1, msg: 'Registered successfully', userId: newUser._id });
    } catch (err) {
        console.error('Error during registration:', err);
        return res.status(500).json({ status: 0, msg: 'Internal server error' });
    }
};


module.exports={loginUser,registerUser}