const Lead = require("../models/Lead")

const getDashboard = async (req, res) => {
    try {
        const totalLeads = await Lead.countDocuments();

        const newLeads = await Lead.countDocuments(
            {
                status: "New"
            }
        )

        const contactedLeads = await Lead.countDocuments(
            {
                status: "Contacted"
            }
        )

        const highPriorityLeads = await Lead.countDocuments({
            priority: "High"
        });

        res.status(200).json({
            totalLeads, newLeads, contactedLeads, highPriorityLeads
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = { getDashboard }