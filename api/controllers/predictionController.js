import Prediction from "../models/predictionModel.js";

export const getUserPredictions = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const predictions = await Prediction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};