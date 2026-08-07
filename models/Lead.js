const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String
    },

    phone: {
      type: String
    },

    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Qualified",
        "Proposal Sent",
        "Closed"
      ],
      default: "New"
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true
    },

    salesAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalesAgent",
      required: true
},
    source: {
      type: String,
      enum: [
        "Website",
        "LinkedIn",
        "Instagram",
        "Referral"
      ]
    }
  },
  {
    timestamps: true
  }
);

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;