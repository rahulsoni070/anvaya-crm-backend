const Lead = require("../models/Lead");

const getReports = async (req, res) => {
    try {
        const totalLeads = await Lead.countDocuments();
        const closedCount = await Lead.countDocuments({ status: "Closed" });
        const pipelineCount = totalLeads - closedCount;

        const closedVsPipeline = [
            { name: "Closed", value: closedCount },
            { name: "Pipeline", value: pipelineCount }
        ];

        const closedBySalesAgent = await Lead.aggregate([
            { $match: { status: "Closed" } },
            {
                $group: {
                    _id: "$salesAgent",
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "agent"
                }
            },
            {
                $unwind: {
                    path: "$agent",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    agent: { $ifNull: ["$agent.name", "Unassigned"] },
                    count: 1
                }
            }
        ]);

        const statuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];

        const statusDistribution = await Promise.all(
            statuses.map(async (status) => ({
                status,
                count: await Lead.countDocuments({ status })
            }))
        );

        res.status(200).json({
            closedVsPipeline,
            closedBySalesAgent,
            statusDistribution
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { getReports };