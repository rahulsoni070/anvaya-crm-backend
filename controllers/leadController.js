const Lead = require("../models/Lead")

const createLead = async (req, res) => {
    try {
        const lead = await Lead.create(req.body);
        res.status(201).json(lead);
    } catch (error) {

        res.status(500).json({
            message: error.message
        })
    }
}

const getLeads = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filters = {};

        // Status filter
        if (req.query.status) {
            filters.status = req.query.status;
        }

        // Priority filter
        if (req.query.priority) {
            filters.priority = req.query.priority;
        }

        // Search
        if (req.query.search) {
            const search = req.query.search;

            filters.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { status: { $regex: search, $options: "i" } }
            ];
        }

        const allowedSortFields = [
            "name",
            "-name",
            "createdAt",
            "-createdAt",
            "priority",
            "-priority"
        ];

        let sort = req.query.sort || "-createdAt";

        if (!allowedSortFields.includes(sort)) {
            sort = "-createdAt";
        }

        const totalLeads = await Lead.countDocuments(filters);

        const totalPages = Math.ceil(totalLeads / limit) || 1;

        const leads = await Lead.find(filters)
            .populate("salesAgent", "name email")
            .sort(sort)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            leads,
            currentPage: page,
            totalPages,
            totalLeads
        });

    } catch (error) {
        console.error("GET LEADS ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

const getLeadById = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id)
        .populate("salesAgent");

        if(!lead) {
            return res.status(404).json({
                message: "Lead not found"
            })
        }

        res.status(200).json(lead)
    } catch (error){
        res.status(500).json({
            message: error.message
        })
    }
}

const updateLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!lead) {
            return res.status(404).json({
                message: "Lead not found"
            })
        }

        res.status(200).json(lead)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id)

        if(!lead) {
            return res.status(404).json({
                message: "Lead not found"
            })
        }

        res.status(200).json(lead)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getTags = async (req, res) => {
    try {
        const tags = await Lead.distinct("tags");
        res.status(200).json(tags.filter(Boolean));
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createLead, getLeads, updateLead, deleteLead, getLeadById, getTags
}