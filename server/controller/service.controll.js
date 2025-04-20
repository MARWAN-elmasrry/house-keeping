const Service = require("../models/service.model");
const Seller = require("../models/saller.model");

const addService = async (req, res) => {
    console.log("Received:", req.body);
    try {
        const { seller , title, description, price, category, image } = req.body;
        const existingService = await Service.findOne({ seller, category });
        if (existingService) {return res.status(400).json({ error: "Seller already has a service in this category" });}
        const newService = new Service({ seller, title, description, price, category, image });
        await newService.save();
        await Seller.findByIdAndUpdate(
            seller,
            { $push: { services: newService._id } },
            { new: true }
        );
        res.status(201).json({ message: "Service added successfully", service: newService });
    } catch (error) {
        console.error("Error saving service:", error);
        res.status(500).json({ error: "Failed to save service" });
    }
};

const getOneService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json(service);
    } catch (error) {
        console.error("Error finding service:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getService = async (req, res) => {
    try {
        const { category } = req.body;
        let services;
        if (category) {
            services = await Service.find({ category });
            if (services.length === 0) {
                return res.status(404).json({ message: "No services found in this category" });
            }
            return res.status(200).json({
                message: "Services retrieved successfully for the given category",
                services
            });
        } else {
            services = await Service.find();
            if (services.length === 0) {
                return res.status(404).json({ message: "No services found" });
            }

            return res.status(200).json({
                message: "All services retrieved successfully",
                services
            });
        }
    } catch (error) {
        console.error("Error finding services:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateService = async (req,res) =>{
    try {
            const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!service) return res.status(404).json({ message: "service not found" });
            res.status(200).json(service);
          } catch (error) {
            res.status(400).json({ error: error.message });
          }   
}

const deleteService = async(req,res)=>{
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) return res.status(404).json({ message: "Service not found" });
        res.status(200).json({ message: "Service deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
}
module.exports = {
    addService,
    getService,
    getOneService,
    updateService,
    deleteService
};
