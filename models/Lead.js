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
      type: String,
      match: [/^[0-9]{10}$/, "Phone number must be exactly 10 digits"]
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
      ref: "User",
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
    },

    tags: {
      type: [String],
      default: []
    },

    timeToClose: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;