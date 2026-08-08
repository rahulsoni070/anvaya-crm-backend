const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const leadRoutes = require("./routes/leadRoutes");
const salesAgentRoutes = require("./routes/salesAgentRoutes");
const commentRoutes = require("./routes/commentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes")

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/reports", reportRoutes)

// Connect MongoDB
connectDB();

// Routes
app.use("/api", leadRoutes);
app.use("/api", salesAgentRoutes);
app.use("/api", commentRoutes);
app.use("/api", dashboardRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Anvaya CRM Running");
});

module.exports = app;

if (require.main === module) {
    const PORT = process.env.PORT || 8000;

    app.listen(PORT, () => {
        console.log(`Server Running on PORT ${PORT}`);
    });
}