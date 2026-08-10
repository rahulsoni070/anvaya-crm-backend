const bcrypt = require("bcrypt");
const User = require("../models/User");
const Lead = require("../models/Lead");

const createAgent = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const salesAgent = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "salesAgent"
        });

        salesAgent.password = undefined;

        res.status(201).json(salesAgent);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getAgent = async (req, res) => {
    try {
        const salesAgents = await User.find({
            role: "salesAgent"
        }).select("-password");

        const leadCounts = await Lead.aggregate([
            { $group: { _id: "$salesAgent", count: { $sum: 1 } } }
        ]);

        const countMap = {};
        leadCounts.forEach((item) => {
            if (item._id) countMap[item._id.toString()] = item.count;
        });

        const agentsWithLeadCount = salesAgents.map((agent) => ({
            ...agent.toObject(),
            assignedLeads: countMap[agent._id.toString()] || 0
        }));

        res.status(200).json(agentsWithLeadCount);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateAgent = async (req, res) => {
    try {
        const salesAgent = await User.findOneAndUpdate(
            {
                _id: req.params.id,
                role: "salesAgent"
            },
            req.body,
            {
                new: true
            }
        ).select("-password");

        if (!salesAgent) {
            return res.status(404).json({
                message: "Sales Agent not found."
            });
        }

        res.status(200).json(salesAgent);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteAgent = async (req, res) => {
    try {
        const salesAgent = await User.findOneAndDelete({
            _id: req.params.id,
            role: "salesAgent"
        });

        if (!salesAgent) {
            return res.status(404).json({
                message: "Sales Agent not found."
            });
        }

        res.status(200).json(salesAgent);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createAgent,
    getAgent,
    updateAgent,
    deleteAgent
};