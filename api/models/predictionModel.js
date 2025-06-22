import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    productName: { type: String, required: true },
    basePrice: { type: Number, required: true },
    day: { type: Number, required: true },
    marketingSpend: { type: Number, required: true },
    season: { type: String, required: true },
    brandPresence: { type: Number, required: true },
    location: {
      country: String,
      region: String,
      city: String,
      marketTier: Number,
      incomeLevel: Number,
      inflationRate: Number,
      monthlyExpenses: Number,
      populationDensity: Number,
      urbanizationLevel: String,
      infrastructureScore: Number,
      internetPenetration: Number,
      isFestivalOrHoliday: Boolean
    },
    predictedSales: { type: Number, required: true },
    confidence: { type: Number, required: true },
    marketInsights: {
      marketTier: Number,
      economicImpact: Number,
      infrastructureImpact: Number,
      digitalizationImpact: Number,
      brandImpact: Number
    }
  },
  { timestamps: true }
);

const Prediction = mongoose.models.Prediction || mongoose.model("Prediction", predictionSchema);

export default Prediction;