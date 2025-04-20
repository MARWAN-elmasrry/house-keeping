const Saller = require("../models/saller.model");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

 
const addSaller = async (req,res) =>{
    console.log("Received:" , req.body);
    try{
        const {name,email,password,phone} = req.body;
        const existingSaller = await Saller.findOne({email});
        if (existingSaller){return res.status(400).json({error:"Email already regist"})} 
        const hashedPassword = await bcrypt.hash(password,10);
        const newSaller = new Saller({name,email,password:hashedPassword,phone})
        await newSaller.save()
        res.status(201).json({message:"Saller saved successfull"})
    }catch(error){
        console.error("Error saving Saller:" , error)
        res.status(500).json({error:"Failed to save saller"})
    }
}

const getSaller = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body; // Destructure rememberMe
        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required" });
        }

        const saller = await Saller.findOne({ email });
        if (!saller) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(String(password), saller.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password!" });
        }

        const expiresIn = '2h';  
        const payload = {
            sallerId: saller._id,
            email: saller.email,
            name: saller.name,
            role: saller.role,
            phone: saller.phone,
            services: saller.services, 
            createdAt: saller.createdAt, 
          };
          const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
          
        // Respond with the token and seller info
        res.status(200).json({
            message: "Login successful",
            token,
            saller: {
                id: saller._id,
                email: saller.email,
                name: saller.name,
                role:saller.role,
                phone: saller.phone,// You can return more seller info if needed
            },
        });

    } catch (error) {
        console.error("Error finding saller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateSaller = async (req, res) => {
    try {
        const saller = await Saller.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!saller) return res.status(404).json({ message: "Seller not found" });
        res.status(200).json(saller);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }   
};

const deteleSaller = async(req,res) =>{
    try {
        const saller = await Saller.findByIdAndDelete(req.params.id);
        if (!saller) return res.status(404).json({ message: "Saller not found" });
        res.status(200).json({ message: "Saller deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

module.exports = {
    addSaller,
    getSaller,
    updateSaller,
    deteleSaller
}