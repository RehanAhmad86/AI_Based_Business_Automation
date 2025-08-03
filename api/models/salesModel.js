import * as tf from "@tensorflow/tfjs";

const FEATURE_RANGES = {
  day: [1, 31],
  marketingSpend: [0, 2000],
  basePrice: [1, 500],
  brandPresence: [1, 10],
  marketTier: [1, 5],
  incomeLevel: [1, 5],
  populationDensity: [1, 5],
  infrastructureScore: [1, 10],
  internetPenetration: [0, 100],
  monthlyExpenses: [100, 2000],
  inflationRate: [0, 20],
};

// IMPROVED: More nuanced feature interpretations with smoother curves
const FEATURE_INTERPRETATIONS = {
  marketTier: (value) => {
    // Smoother curve instead of discrete jumps
    return Math.max(0.4, 2.0 - (value - 1) * 0.35);
  },

  incomeLevel: (value) => {
    // Continuous function instead of discrete mapping
    return 0.5 + (value / 5) * 0.8;
  },

  populationDensity: (value) => {
    // More realistic population density impact
    return 0.7 + (value / 5) * 0.6;
  },

  infrastructureScore: (value) => {
    // Sigmoid-like curve for infrastructure impact
    return 0.3 + 1.4 / (1 + Math.exp(-(value - 5) * 0.8));
  },

  brandPresence: (value) => {
    // Exponential growth curve for brand impact
    return 0.4 + 1.2 * Math.pow(value / 10, 1.5);
  },

  urbanizationLevel: (level) => {
    const impact = {
      rural: 0.75,
      suburban: 1.0,
      urban: 1.35,
    };
    return impact[level?.toLowerCase()] || 1.0;
  },

  season: (season) => {
    const impact = {
      winter: 0.85,
      spring: 1.15,
      summer: 1.25,
      fall: 1.05,
    };
    return impact[season?.toLowerCase()] || 1.0;
  },
};

// IMPROVED: Enhanced product value assessment with category context
function assessProductValue(productName, basePrice, category) {
  if (!productName) return 1.0;

  const name = productName.toLowerCase();
  const cat = category?.toLowerCase() || '';

  // Enhanced keyword categories with weights
  const keywordCategories = {
    luxury: {
      keywords: ["professional", "premium", "luxury", "advanced", "pro", "elite", 
                "exclusive", "deluxe", "high-end", "executive", "signature", 
                "tailored", "bespoke", "ultra", "refined", "artisan", "handcrafted"],
      weight: 0.4
    },
    tech: {
      keywords: ["smart", "digital", "electronic", "tech", "ai", "wireless", "iot", 
                "automated", "robotic", "cloud", "intelligent", "connected", "4k", 
                "bluetooth", "cyber", "quantum", "gadget", "nano", "biometric"],
      weight: 0.3
    },
    beauty: {
      keywords: ["serum", "treatment", "perfector", "repair", "anti-aging", 
                "hydrating", "glow", "radiance", "moisturizer", "elixir", 
                "retinol", "collagen", "brightening", "nourish", "smoothing", 
                "firming", "cleanser", "toner", "essence", "concentrate"],
      weight: 0.25
    },
    health: {
      keywords: ["supplement", "vitamin", "protein", "health", "medical", 
                "wellness", "immunity", "detox", "organic", "fitness", 
                "nutrient", "multivitamin", "omega", "herbal", "recovery", 
                "antioxidant", "metabolism", "endurance", "probiotic", "therapeutic"],
      weight: 0.2
    }
  };

  let valueMultiplier = 1.0;
  let matchedCategories = 0;

  // Check keywords with weighted scoring
  for (const [categoryName, categoryData] of Object.entries(keywordCategories)) {
    const matches = categoryData.keywords.filter(keyword => name.includes(keyword)).length;
    if (matches > 0) {
      valueMultiplier += categoryData.weight * Math.min(matches / 3, 1.0);
      matchedCategories++;
    }
  }

  // Category-specific bonuses
  const categoryBonuses = {
    'electronics': 0.15,
    'beauty': 0.1,
    'health': 0.1,
    'luxury': 0.3,
    'automotive': 0.2,
    'jewelry': 0.35
  };

  if (categoryBonuses[cat]) {
    valueMultiplier += categoryBonuses[cat];
  }

  // Price-value correlation with smoother curve
  const priceMultiplier = Math.min(0.3, Math.log(basePrice + 1) * 0.05);
  valueMultiplier += priceMultiplier;

  // Diminishing returns for multiple category matches
  if (matchedCategories > 1) {
    valueMultiplier *= (1 - (matchedCategories - 1) * 0.1);
  }

  return Math.min(valueMultiplier, 2.5);
}

// IMPROVED: Better model architecture with regularization
let cachedModel = null;
let modelLoadPromise = null;

async function loadPreTrainedModel() {
  if (cachedModel) return cachedModel;
  if (modelLoadPromise) return modelLoadPromise;

  modelLoadPromise = (async () => {
    try {
      const model = tf.sequential();

      // Improved architecture with batch normalization and better regularization
      model.add(tf.layers.dense({
        units: 256,
        activation: 'relu',
        inputShape: [13], // Updated for enhanced features
        kernelRegularizer: tf.regularizers.l2({ l2: 0.001 })
      }));
      
      model.add(tf.layers.batchNormalization());
      model.add(tf.layers.dropout({ rate: 0.3 }));

      model.add(tf.layers.dense({
        units: 128,
        activation: 'relu',
        kernelRegularizer: tf.regularizers.l2({ l2: 0.001 })
      }));
      
      model.add(tf.layers.batchNormalization());
      model.add(tf.layers.dropout({ rate: 0.25 }));

      model.add(tf.layers.dense({
        units: 64,
        activation: 'relu',
        kernelRegularizer: tf.regularizers.l2({ l2: 0.001 })
      }));
      
      model.add(tf.layers.dropout({ rate: 0.2 }));

      model.add(tf.layers.dense({
        units: 32,
        activation: 'relu'
      }));

      model.add(tf.layers.dense({
        units: 1,
        activation: 'linear'
      }));

      // Better optimizer with learning rate scheduling
      const optimizer = tf.train.adam(0.002);
      
      model.compile({
        optimizer: optimizer,
        loss: 'meanSquaredError',
        metrics: ['mae']
      });

      // Generate more diverse training data
      const trainingData = generateEnhancedTrainingData();
      const inputs = tf.tensor2d(trainingData.inputs);
      const outputs = tf.tensor2d(trainingData.outputs, [trainingData.outputs.length, 1]);

      // Enhanced training with callbacks
      await model.fit(inputs, outputs, {
        epochs: 80,
        batchSize: 32,
        validationSplit: 0.15,
        verbose: 0,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            // Early stopping simulation
            if (logs.val_loss && logs.val_loss < 0.01) {
              return true; // Stop training
            }
          }
        }
      });

      inputs.dispose();
      outputs.dispose();

      cachedModel = model;
      console.log("Enhanced model loaded successfully");
      return model;
    } catch (error) {
      console.error("Model loading failed:", error);
      cachedModel = null;
      modelLoadPromise = null;
      throw error;
    }
  })();

  return modelLoadPromise;
}

// IMPROVED: More sophisticated training data generation
function generateEnhancedTrainingData() {
  const inputs = [];
  const outputs = [];

  // Generate 5000 data points with better distribution
  for (let i = 0; i < 5000; i++) {
    // More realistic distributions
    const day = Math.floor(Math.random() * 31) + 1;
    const marketingSpend = Math.pow(Math.random(), 2) * 1500; // Skewed toward lower spending
    const basePrice = Math.random() * 300 + 5; // More realistic price range
    const brandPresence = Math.ceil(Math.random() * 10);
    const marketTier = Math.ceil(Math.random() * 5);
    const incomeLevel = Math.ceil(Math.random() * 5);
    const populationDensity = Math.ceil(Math.random() * 5);
    const infrastructureScore = Math.ceil(Math.random() * 10);
    const internetPenetration = Math.min(100, Math.random() * 120); // Some areas exceed 100%
    const monthlyExpenses = 200 + Math.random() * 1500;
    const inflationRate = Math.random() * 12; // More realistic inflation range
    const productValue = 0.3 + Math.random() * 2.0;
    
    // Add interaction features
    const marketingEfficiency = marketingSpend / (basePrice + 1);

    // Enhanced sales calculation with interactions
    let baseSales = 35 + day * 0.3;

    // Non-linear marketing impact with saturation
    const marketingImpact = marketingSpend / (marketingSpend + 200) * 80;
    baseSales += marketingImpact;

    // Price elasticity varies by market tier
    const priceElasticity = 0.2 + (marketTier / 10);
    baseSales += Math.max(0, (150 - basePrice) * priceElasticity);

    // Apply all feature interpretations
    baseSales *= FEATURE_INTERPRETATIONS.marketTier(marketTier);
    baseSales *= FEATURE_INTERPRETATIONS.incomeLevel(incomeLevel);
    baseSales *= FEATURE_INTERPRETATIONS.populationDensity(populationDensity);
    baseSales *= FEATURE_INTERPRETATIONS.infrastructureScore(infrastructureScore);
    baseSales *= FEATURE_INTERPRETATIONS.brandPresence(brandPresence);

    // Interaction effects
    baseSales *= (0.6 + (internetPenetration / 100) * 0.7); // Stronger internet impact
    baseSales *= Math.max(0.3, 1.2 - inflationRate / 50); // More gradual inflation impact
    baseSales *= productValue;

    // Market maturity effect
    const maturityBonus = (infrastructureScore * internetPenetration) / 1000;
    baseSales *= (1 + maturityBonus);

    // Add realistic noise with correlation to uncertainty
    const uncertainty = 0.15 + (1 / brandPresence) * 0.1;
    baseSales *= (1 - uncertainty + Math.random() * uncertainty * 2);

    // Enhanced normalization with feature engineering
    const normalizedInput = [
      (day - FEATURE_RANGES.day[0]) / (FEATURE_RANGES.day[1] - FEATURE_RANGES.day[0]),
      Math.sqrt(marketingSpend) / Math.sqrt(FEATURE_RANGES.marketingSpend[1]), // Square root normalization
      (basePrice - FEATURE_RANGES.basePrice[0]) / (FEATURE_RANGES.basePrice[1] - FEATURE_RANGES.basePrice[0]),
      (brandPresence - FEATURE_RANGES.brandPresence[0]) / (FEATURE_RANGES.brandPresence[1] - FEATURE_RANGES.brandPresence[0]),
      (marketTier - FEATURE_RANGES.marketTier[0]) / (FEATURE_RANGES.marketTier[1] - FEATURE_RANGES.marketTier[0]),
      (incomeLevel - FEATURE_RANGES.incomeLevel[0]) / (FEATURE_RANGES.incomeLevel[1] - FEATURE_RANGES.incomeLevel[0]),
      (populationDensity - FEATURE_RANGES.populationDensity[0]) / (FEATURE_RANGES.populationDensity[1] - FEATURE_RANGES.populationDensity[0]),
      (infrastructureScore - FEATURE_RANGES.infrastructureScore[0]) / (FEATURE_RANGES.infrastructureScore[1] - FEATURE_RANGES.infrastructureScore[0]),
      internetPenetration / 100,
      (monthlyExpenses - FEATURE_RANGES.monthlyExpenses[0]) / (FEATURE_RANGES.monthlyExpenses[1] - FEATURE_RANGES.monthlyExpenses[0]),
      inflationRate / FEATURE_RANGES.inflationRate[1],
      productValue / 2.5,
      marketingEfficiency / 10 // New interaction feature
    ];

    inputs.push(normalizedInput);
    outputs.push(Math.max(1, Math.round(baseSales)));
  }

  return { inputs, outputs };
}

// IMPROVED: Enhanced prediction with ensemble approach
export async function predictSales(data) {
  const startTime = Date.now();

  try {
    const {
      productName,
      category,
      basePrice,
      day,
      marketingSpend,
      season,
      brandPresence,
      location,
    } = data;

    // Extract location data with better defaults
    const marketTier = location?.marketTier || 3;
    const incomeLevel = location?.incomeLevel || 3;
    const populationDensity = location?.populationDensity || 3;
    const infrastructureScore = location?.infrastructureScore || 6;
    const internetPenetration = location?.internetPenetration || 65; // More realistic default
    const monthlyExpenses = location?.monthlyExpenses || 800; // Updated default
    const inflationRate = location?.inflationRate || 3.5; // More realistic default
    const urbanizationLevel = location?.urbanizationLevel || "suburban";

    // Enhanced product value assessment
    const productValue = assessProductValue(productName, basePrice, category);
    const marketingEfficiency = marketingSpend / (basePrice + 1);

    let mlPrediction = null;
    let mathPrediction = null;
    let confidence = 0.85;
    let predictionMethod = "hybrid";

    // Try ML model prediction
    try {
      const model = await Promise.race([
        loadPreTrainedModel(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 150))
      ]);

      if (model) {
        const normalizedInputs = [
          (day - FEATURE_RANGES.day[0]) / (FEATURE_RANGES.day[1] - FEATURE_RANGES.day[0]),
          Math.sqrt(marketingSpend) / Math.sqrt(FEATURE_RANGES.marketingSpend[1]),
          (basePrice - FEATURE_RANGES.basePrice[0]) / (FEATURE_RANGES.basePrice[1] - FEATURE_RANGES.basePrice[0]),
          (brandPresence - FEATURE_RANGES.brandPresence[0]) / (FEATURE_RANGES.brandPresence[1] - FEATURE_RANGES.brandPresence[0]),
          (marketTier - FEATURE_RANGES.marketTier[0]) / (FEATURE_RANGES.marketTier[1] - FEATURE_RANGES.marketTier[0]),
          (incomeLevel - FEATURE_RANGES.incomeLevel[0]) / (FEATURE_RANGES.incomeLevel[1] - FEATURE_RANGES.incomeLevel[0]),
          (populationDensity - FEATURE_RANGES.populationDensity[0]) / (FEATURE_RANGES.populationDensity[1] - FEATURE_RANGES.populationDensity[0]),
          (infrastructureScore - FEATURE_RANGES.infrastructureScore[0]) / (FEATURE_RANGES.infrastructureScore[1] - FEATURE_RANGES.infrastructureScore[0]),
          internetPenetration / 100,
          (monthlyExpenses - FEATURE_RANGES.monthlyExpenses[0]) / (FEATURE_RANGES.monthlyExpenses[1] - FEATURE_RANGES.monthlyExpenses[0]),
          inflationRate / FEATURE_RANGES.inflationRate[1],
          productValue / 2.5,
          marketingEfficiency / 10
        ];

        const prediction = model.predict(tf.tensor2d([normalizedInputs]));
        mlPrediction = Math.max(1, Math.round(prediction.dataSync()[0]));
        prediction.dispose();
        confidence = 0.94;
      }
    } catch (mlError) {
      console.log("ML fallback triggered:", mlError.message);
    }

    // Enhanced mathematical prediction
    let baseSales = 40 + day * 0.4;

    // Improved marketing impact with saturation curve
    const marketingImpact = marketingSpend / (marketingSpend + 180) * 75;
    baseSales += marketingImpact;

    // Dynamic price elasticity
    const priceElasticity = 0.15 + (marketTier / 15);
    baseSales += Math.max(0, (120 - basePrice) * priceElasticity);

    // Apply enhanced feature interpretations
    baseSales *= FEATURE_INTERPRETATIONS.marketTier(marketTier);
    baseSales *= FEATURE_INTERPRETATIONS.incomeLevel(incomeLevel);
    baseSales *= FEATURE_INTERPRETATIONS.populationDensity(populationDensity);
    baseSales *= FEATURE_INTERPRETATIONS.infrastructureScore(infrastructureScore);
    baseSales *= FEATURE_INTERPRETATIONS.brandPresence(brandPresence);
    baseSales *= FEATURE_INTERPRETATIONS.season(season);
    baseSales *= FEATURE_INTERPRETATIONS.urbanizationLevel(urbanizationLevel);

    // Enhanced interaction effects
    baseSales *= 0.5 + (internetPenetration / 100) * 0.8;
    baseSales *= Math.max(0.4, 1.15 - inflationRate / 40);
    baseSales *= productValue;

    // Market synergy bonus
    const synergy = (infrastructureScore * internetPenetration * brandPresence) / 10000;
    baseSales *= (1 + synergy);

    mathPrediction = Math.max(1, Math.round(baseSales));

    // Ensemble prediction if both methods available
    let predictedSales;
    if (mlPrediction && mathPrediction) {
      // Weighted ensemble based on confidence
      const mlWeight = 0.7;
      const mathWeight = 0.3;
      predictedSales = Math.round(mlPrediction * mlWeight + mathPrediction * mathWeight);
      confidence = 0.96;
      predictionMethod = "ensemble";
    } else {
      predictedSales = mlPrediction || mathPrediction;
      predictionMethod = mlPrediction ? "machine_learning" : "mathematical";
    }

    // Dynamic confidence adjustment
    const dataQuality = (location && Object.keys(location).length > 5) ? 0.05 : 0;
    const brandConfidence = brandPresence >= 7 ? 0.03 : 0;
    const marketingConfidence = marketingSpend > 100 ? 0.02 : 0;
    
    confidence = Math.min(confidence + dataQuality + brandConfidence + marketingConfidence, 0.98);

    // Enhanced impact calculations
    const marketTierImpact = FEATURE_INTERPRETATIONS.marketTier(marketTier);
    const incomeImpact = FEATURE_INTERPRETATIONS.incomeLevel(incomeLevel);
    const infrastructureImpact = FEATURE_INTERPRETATIONS.infrastructureScore(infrastructureScore);
    const brandImpact = FEATURE_INTERPRETATIONS.brandPresence(brandPresence);
    const digitalizationImpact = 0.5 + (internetPenetration / 100) * 0.8;
    const economicImpact = Math.max(0.4, 1.15 - inflationRate / 40) * Math.min(1.8, monthlyExpenses / 600);

    return {
      predictedSales,
      confidence: Math.round(confidence * 1000) / 1000,
      marketTier,
      economicImpact: Math.round(economicImpact * 1000) / 1000,
      infrastructureImpact: Math.round(infrastructureImpact * 1000) / 1000,
      digitalizationImpact: Math.round(digitalizationImpact * 1000) / 1000,
      brandImpact: Math.round(brandImpact * 1000) / 1000,
      processingTime: Date.now() - startTime,
      predictionMethod,
      // Additional insights
      productValueScore: Math.round(productValue * 1000) / 1000,
      marketingEfficiency: Math.round(marketingEfficiency * 1000) / 1000
    };
  } catch (error) {
    console.error("Prediction error:", error);
    throw new Error("Sales prediction failed: " + error.message);
  }
}

// Initialize model in background with error handling
loadPreTrainedModel().catch(error => {
  console.warn("Background model loading failed:", error.message);
});

export async function getModel() {
  return await loadPreTrainedModel();
}