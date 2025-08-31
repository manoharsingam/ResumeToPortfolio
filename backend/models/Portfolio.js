// const mongoose = require("mongoose");

// const PortfolioSchema = new mongoose.Schema({
//   resumeText: { type: String, required: true },
//   generatedCode: { type: String, required: true },
//   template: { type: String, default: "template1" },
//   level: { type: String, default: "basic" },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Portfolio", PortfolioSchema);



const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    resumeText: {
      type: String,
      required: true,
    },
    generatedCode: {
      type: String,
      required: true,
    },
    template: {
      type: String,
      default: "template1",
    },
    level: {
      type: String,
      default: "basic",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

module.exports = Portfolio;