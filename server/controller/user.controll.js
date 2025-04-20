const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const addUser = async (req, res) => {
    console.log("Received:", req.body);

    try {
        const { name, email, password , phone , role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {return res.status(400).json({ error: "Email already registered" });}
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, phone , role});
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ error: "Failed to save user" });
    }
};

const getUser = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;
        console.log(req.body);

        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(String(password), user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password!" });
        }

        const expiresIn = '2h';  // 30 days if rememberMe, 2 hour if not

        // Generate JWT token
        const payload = { 
            sallerId: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone,
            services: user.services, 
            createdAt: user.createdAt,
            orderedServices:user.orderedServices 
         }; 
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

        // Send response with token and user data
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,  
                role:user.role,
                orderedServices:user.orderedServices // You can return more user info if needed
            },
        });

    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { orderedServices } = req.body;
  
      // Use $push to append to the orderedServices array
      const user = await User.findByIdAndUpdate(
        id,
        { $push: { orderedServices: orderedServices } }, // Append the new serviceId
        { new: true, runValidators: true } // Return the updated user and validate data
      );
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

const deteleUser = async(req,res) =>{
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

module.exports = { 
    addUser,
    getUser,
    updateUser,
    deteleUser
};