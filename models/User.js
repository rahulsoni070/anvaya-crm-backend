const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
    },
    password: {
        type: String,
        required: function () {
            return this.role !== "salesAgent";
        },
    },
    role: {
        type: String,
        enum: ["admin", "salesAgent"],
        default: "salesAgent"
    }
},

{
    timestamps: true
}
)

module.exports = mongoose.model("User", userSchema);