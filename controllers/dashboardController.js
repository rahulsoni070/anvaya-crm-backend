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

        const qualifiedLeads = await Lead.countDocuments(
            {
                status: "Qualified"
            }
        )

        const highPriorityLeads = await Lead.countDocuments({
            priority: "High"
        });

        const recentLeads = await Lead.find()
            .sort("-createdAt")
            .limit(5)
            .select("name status priority");

        res.status(200).json({
            totalLeads,
            newLeads,
            contactedLeads,
            qualifiedLeads,
            highPriorityLeads,
            recentLeads
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = { getDashboard }