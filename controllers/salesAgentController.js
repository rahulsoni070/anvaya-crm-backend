const SalesAgent = require("../models/SalesAgent");
const Lead = require("../models/Lead");

const createAgent = async (req, res) => {
    try {
        const salesAgent = await SalesAgent.create(req.body);
        res.status(201).json(salesAgent)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getAgent = async (req, res) => {
    try {
        const salesAgents = await SalesAgent.find();

        const agentsWithLeadCount = await Promise.all(
            salesAgents.map(async (agent) => {

                const assignedLeads = await Lead.countDocuments({
                    salesAgent: agent._id
                });

                return {
                    ...agent.toObject(),
                    assignedLeads
                };
            })
        );

        res.status(200).json(agentsWithLeadCount);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateAgent = async(req, res) => {
    try{
        const salesAgent = await SalesAgent.findByIdAndUpdate(req.params.id, req.body, 
            {
                new: true
            }
        );
        if(!salesAgent) {
            return res.status(404).json({
                message: "Sales Agent not found."
            })
        }
        res.status(200).json(salesAgent)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const deleteAgent = async(req, res) => {
    try{
        const salesAgent = await SalesAgent.findByIdAndDelete(req.params.id);
        if(!salesAgent) {
            return res.status(404).json({
                message: "Sales Agent not found."
            })
        }
        res.status(200).json(salesAgent)

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {createAgent, getAgent, updateAgent, deleteAgent}