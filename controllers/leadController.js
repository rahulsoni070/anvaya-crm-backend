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

        const filters = { ...req.query };

        if(!filters.status) {
            delete filters.status;
        }

        if (!filters.priority) {
            delete filters.priority;
        }

        delete filters.page;
        delete filters.limit;
        delete filters.sort;
        delete filters.search;
        
        const search = req.query.search;

        if (search) {
    filters.$or = [
        {
            name: {
                $regex: search,
                $options: "i"
            }
        },
        {
            email: {
                $regex: search,
                $options: "i"
            }
        },
        {
            phone: {
                $regex: search,
                $options: "i"
            }
        },
        {
            status: {
                $regex: search,
                $options: "i"
            }
        }
    ];
}

const totalLeads = await Lead.countDocuments(filters);
const totalPages = Math.ceil(totalLeads / limit);

        const allowedSortField = [
            "name",
            "-name",
            "createdAt",
            "-createdAt",
            "priority",
            "-priority"
        ];

        let sort = req.query.sort || "-createdAt";

        if (!allowedSortField.includes(sort)) {
            sort = "-createdAt"
        }

        const leads = await Lead.find(filters)
            .populate("salesAgent", "name email")
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .collation({ locale: "en", strength: 2 })
            

        res.status(200).json({
            leads: leads,
            currentPage: page,
            totalPages: totalPages,
            totalLeads: totalLeads
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

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
                new: true
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

module.exports = {
    createLead, getLeads, updateLead, deleteLead, getLeadById
}

