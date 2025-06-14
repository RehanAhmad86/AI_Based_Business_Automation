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

const FEATURE_INTERPRETATIONS = {
  marketTier: (value) => {
    const impact = { 1: 1.5, 2: 1.3, 3: 1.0, 4: 0.8, 5: 0.6 };
    return impact[value] || 1.0;
  },

  incomeLevel: (value) => {
    const impact = {
      low: 0.7,
      medium: 1.0,
      high: 1.3,
    };
    return impact[value] || 1.0; 
  },

  populationDensity: (value) => {
    const impact = {
      low: 0.8,
      medium: 1.0,
      high: 1.2,
    };
    return impact[value] || 1.0; 
  },

  infrastructureScore: (value) => {
    if (value <= 2) return 0.5; 
    if (value <= 4) return 0.7; 
    if (value <= 6) return 1.0; 
    if (value <= 8) return 1.2; 
    return 1.4;
  },

  brandPresence: (value) => {
    if (value <= 2) return 0.6; // Very Weak
    if (value <= 4) return 0.8; // Weak
    if (value <= 6) return 1.0; // Medium
    if (value <= 8) return 1.2; // Strong
    return 1.4; // Very Strong
  },

  urbanizationLevel: (level) => {
    const impact = {
      rural: 0.8,
      suburban: 1.0,
      urban: 1.2,
    };
    return impact[level?.toLowerCase()] || 1.0;
  },

  season: (season) => {
    const impact = {
      winter: 0.9, // Lower consumer activity
      spring: 1.1, // Increased buying
      summer: 1.2, // Peak season
      fall: 1.0, // Moderate activity
    };
    return impact[season?.toLowerCase()] || 1.0;
  },
};

function assessProductValue(productName, basePrice) {
  if (!productName) return 1.0;

  const name = productName.toLowerCase();

  // RESTORED: All original keyword categories
  const highValueKeywords = [
    "professional",
    "premium",
    "luxury",
    "advanced",
    "pro",
    "elite",
    "exclusive",
    "deluxe",
    "high-end",
    "executive",
    "signature",
    "tailored",
    "bespoke",
    "ultra",
    "refined",
  ];

  const techKeywords = [
    "smart",
    "digital",
    "electronic",
    "tech",
    "ai",
    "wireless",
    "iot",
    "automated",
    "robotic",
    "cloud",
    "intelligent",
    "connected",
    "4k",
    "bluetooth",
    "cyber",
    "quantum",
    "gadget",
  ];

  const beautyKeywords = [
    "serum",
    "treatment",
    "perfector",
    "repair",
    "anti-aging",
    "hydrating",
    "glow",
    "radiance",
    "moisturizer",
    "elixir",
    "retinol",
    "collagen",
    "brightening",
    "nourish",
    "smoothing",
    "firming",
    "cleanser",
    "toner",
    "essence",
  ];
  const healthKeywords = [
    "supplement",
    "vitamin",
    "protein",
    "health",
    "medical",
    "wellness",
    "immunity",
    "detox",
    "organic",
    "fitness",
    "nutrient",
    "multivitamin",
    "omega",
    "herbal",
    "recovery",
    "antioxidant",
    "metabolism",
    "endurance",
    "probiotic",
  ];

  let valueMultiplier = 1.0;

  // RESTORED: Original keyword checking logic
  if (highValueKeywords.some((keyword) => name.includes(keyword))) {
    valueMultiplier += 0.3;
  }

  // Technology products often have higher perceived value
  if (techKeywords.some((keyword) => name.includes(keyword))) {
    valueMultiplier += 0.2;
  }

  // Beauty and health products with treatment/professional terms
  if (beautyKeywords.some((keyword) => name.includes(keyword))) {
    valueMultiplier += 0.15;
  }

  if (healthKeywords.some((keyword) => name.includes(keyword))) {
    valueMultiplier += 0.1;
  }

  // RESTORED: Original price-based value assessment
  if (basePrice > 100) valueMultiplier += 0.2;
  else if (basePrice > 50) valueMultiplier += 0.1;
  else if (basePrice < 10) valueMultiplier -= 0.1;

  return Math.min(valueMultiplier, 2.0); // Cap at 2x
}

// HYBRID APPROACH: Pre-trained model loaded once, not trained on each request
let cachedModel = null;
let modelLoadPromise = null;

// Load pre-trained model weights (simulation - in real app you'd load from file)
async function loadPreTrainedModel() {
  if (cachedModel) return cachedModel;

  if (modelLoadPromise) return modelLoadPromise;

  modelLoadPromise = (async () => {
    try {
      // Create model architecture (same as original)
      const model = tf.sequential();

      // RESTORED: Original architecture but optimized
      model.add(
        tf.layers.dense({
          units: 128,
          activation: "relu",
          inputShape: [12],
        })
      );

      model.add(tf.layers.dropout({ rate: 0.2 }));
      model.add(tf.layers.dense({ units: 64, activation: "relu" }));
      model.add(tf.layers.dropout({ rate: 0.2 }));
      model.add(tf.layers.dense({ units: 32, activation: "relu" }));
      model.add(tf.layers.dense({ units: 16, activation: "relu" }));
      model.add(tf.layers.dense({ units: 1, activation: "linear" }));

      model.compile({
        optimizer: tf.train.adam(0.001),
        loss: "meanSquaredError",
      });

      // OPTIMIZATION: Train once and cache (or load pre-trained weights)
      // In production, you'd load saved weights instead of training
      const trainingData = generateRealisticTrainingData();
      const inputs = tf.tensor2d(trainingData.inputs);
      const outputs = tf.tensor2d(trainingData.outputs, [
        trainingData.outputs.length,
        1,
      ]);

      // Quick training (reduced epochs for faster initialization)
      await model.fit(inputs, outputs, {
        epochs: 50, // Reduced from 200
        batchSize: 64, // Increased batch size
        validationSplit: 0.1, // Reduced validation
        verbose: 0,
      });

      inputs.dispose();
      outputs.dispose();

      cachedModel = model;
      console.log("Pre-trained model loaded successfully");
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

// RESTORED: Original training data generation with all complexity
function generateRealisticTrainingData() {
  const inputs = [];
  const outputs = [];

  // Generate 3000 realistic data points (reduced from 5000 for speed)
  for (let i = 0; i < 3000; i++) {
    // Random but realistic values
    const day = Math.floor(Math.random() * 31) + 1;
    const marketingSpend = Math.random() * 1000;
    const basePrice = Math.random() * 200 + 10;
    const brandPresence = Math.floor(Math.random() * 10) + 1;
    const marketTier = Math.floor(Math.random() * 5) + 1;
    const incomeLevel = Math.floor(Math.random() * 5) + 1;
    const populationDensity = Math.floor(Math.random() * 5) + 1;
    const infrastructureScore = Math.floor(Math.random() * 10) + 1;
    const internetPenetration = Math.random() * 100;
    const monthlyExpenses = Math.random() * 1500 + 200;
    const inflationRate = Math.random() * 10;
    const productValue = Math.random() * 1.5 + 0.5;

    // RESTORED: Original complex sales calculation
    let baseSales = 40; // Base sales number

    // Marketing impact (logarithmic)
    baseSales += Math.log(marketingSpend + 1) * 5;

    // Price impact (inverse relationship)
    baseSales += Math.max(0, (100 - basePrice) * 0.3);

    // Market and economic factors
    baseSales *= FEATURE_INTERPRETATIONS.marketTier(marketTier);
    baseSales *= FEATURE_INTERPRETATIONS.incomeLevel(incomeLevel);
    baseSales *= FEATURE_INTERPRETATIONS.populationDensity(populationDensity);
    baseSales *=
      FEATURE_INTERPRETATIONS.infrastructureScore(infrastructureScore);
    baseSales *= FEATURE_INTERPRETATIONS.brandPresence(brandPresence);

    // Internet penetration impact
    baseSales *= 0.7 + (internetPenetration / 100) * 0.3;

    // Inflation impact (negative)
    baseSales *= Math.max(0.5, 1 - inflationRate / 100);

    // Product value impact
    baseSales *= productValue;

    // Add some realistic noise
    baseSales *= 0.8 + Math.random() * 0.4;

    // RESTORED: Original normalization
    const normalizedInput = [
      (day - FEATURE_RANGES.day[0]) /
      (FEATURE_RANGES.day[1] - FEATURE_RANGES.day[0]),
      marketingSpend / FEATURE_RANGES.marketingSpend[1],
      (basePrice - FEATURE_RANGES.basePrice[0]) /
      (FEATURE_RANGES.basePrice[1] - FEATURE_RANGES.basePrice[0]),
      (brandPresence - FEATURE_RANGES.brandPresence[0]) /
      (FEATURE_RANGES.brandPresence[1] - FEATURE_RANGES.brandPresence[0]),
      (marketTier - FEATURE_RANGES.marketTier[0]) /
      (FEATURE_RANGES.marketTier[1] - FEATURE_RANGES.marketTier[0]),
      (incomeLevel - FEATURE_RANGES.incomeLevel[0]) /
      (FEATURE_RANGES.incomeLevel[1] - FEATURE_RANGES.incomeLevel[0]),
      (populationDensity - FEATURE_RANGES.populationDensity[0]) /
      (FEATURE_RANGES.populationDensity[1] -
        FEATURE_RANGES.populationDensity[0]),
      (infrastructureScore - FEATURE_RANGES.infrastructureScore[0]) /
      (FEATURE_RANGES.infrastructureScore[1] -
        FEATURE_RANGES.infrastructureScore[0]),
      internetPenetration / 100,
      (monthlyExpenses - FEATURE_RANGES.monthlyExpenses[0]) /
      (FEATURE_RANGES.monthlyExpenses[1] - FEATURE_RANGES.monthlyExpenses[0]),
      inflationRate / FEATURE_RANGES.inflationRate[1],
      productValue / 2.0,
    ];

    inputs.push(normalizedInput);
    outputs.push(Math.max(0, Math.round(baseSales)));
  }

  return { inputs, outputs };
}

// HYBRID: Fast fallback + ML when available
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

    // Extract location data or use defaults
    const marketTier = location?.marketTier || 3;
    const incomeLevel = location?.incomeLevel || 3;
    const populationDensity = location?.populationDensity || 3;
    const infrastructureScore = location?.infrastructureScore || 6;
    const internetPenetration = location?.internetPenetration || 50;
    const monthlyExpenses = location?.monthlyExpenses || 500;
    const inflationRate = location?.inflationRate || 5;
    const urbanizationLevel = location?.urbanizationLevel || "suburban";

    // RESTORED: Original product value assessment
    const productValue = assessProductValue(productName, basePrice);

    let predictedSales;
    let confidence = 0.85;
    let predictionMethod = "mathematical";

    // Try ML model first (non-blocking)
    try {
      const model = await Promise.race([
        loadPreTrainedModel(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 100)
        ), // 100ms timeout
      ]);

      if (model) {
        // RESTORED: Original ML prediction with full normalization
        const normalizedInputs = [
          (day - FEATURE_RANGES.day[0]) /
          (FEATURE_RANGES.day[1] - FEATURE_RANGES.day[0]),
          marketingSpend / FEATURE_RANGES.marketingSpend[1],
          (basePrice - FEATURE_RANGES.basePrice[0]) /
          (FEATURE_RANGES.basePrice[1] - FEATURE_RANGES.basePrice[0]),
          (brandPresence - FEATURE_RANGES.brandPresence[0]) /
          (FEATURE_RANGES.brandPresence[1] - FEATURE_RANGES.brandPresence[0]),
          (marketTier - FEATURE_RANGES.marketTier[0]) /
          (FEATURE_RANGES.marketTier[1] - FEATURE_RANGES.marketTier[0]),
          (incomeLevel - FEATURE_RANGES.incomeLevel[0]) /
          (FEATURE_RANGES.incomeLevel[1] - FEATURE_RANGES.incomeLevel[0]),
          (populationDensity - FEATURE_RANGES.populationDensity[0]) /
          (FEATURE_RANGES.populationDensity[1] -
            FEATURE_RANGES.populationDensity[0]),
          (infrastructureScore - FEATURE_RANGES.infrastructureScore[0]) /
          (FEATURE_RANGES.infrastructureScore[1] -
            FEATURE_RANGES.infrastructureScore[0]),
          internetPenetration / 100,
          (monthlyExpenses - FEATURE_RANGES.monthlyExpenses[0]) /
          (FEATURE_RANGES.monthlyExpenses[1] -
            FEATURE_RANGES.monthlyExpenses[0]),
          inflationRate / FEATURE_RANGES.inflationRate[1],
          productValue / 2.0,
        ];

        const prediction = model.predict(tf.tensor2d([normalizedInputs]));
        predictedSales = Math.max(0, Math.round(prediction.dataSync()[0]));
        prediction.dispose();

        confidence = 0.92; // Higher confidence for ML prediction
        predictionMethod = "machine_learning";
      }
    } catch (mlError) {
      // Fall back to mathematical model (instant)
      console.log("Using mathematical fallback:", mlError.message);
    }

    // Fallback to mathematical prediction if ML failed
    if (!predictedSales) {
      // RESTORED: Original complex mathematical calculation
      let baseSales = 50 + day * 0.5;

      // Marketing impact (logarithmic for realistic diminishing returns)
      baseSales += Math.log(marketingSpend + 1) * 5;

      // Price impact (inverse relationship)
      baseSales += Math.max(0, (100 - basePrice) * 0.3);

      // RESTORED: All original multipliers with function calls
      baseSales *= FEATURE_INTERPRETATIONS.marketTier(marketTier);
      baseSales *= FEATURE_INTERPRETATIONS.incomeLevel(incomeLevel);
      baseSales *= FEATURE_INTERPRETATIONS.populationDensity(populationDensity);
      baseSales *=
        FEATURE_INTERPRETATIONS.infrastructureScore(infrastructureScore);
      baseSales *= FEATURE_INTERPRETATIONS.brandPresence(brandPresence);
      baseSales *= FEATURE_INTERPRETATIONS.season(season);
      baseSales *= FEATURE_INTERPRETATIONS.urbanizationLevel(urbanizationLevel);

      // Internet penetration impact
      baseSales *= 0.7 + (internetPenetration / 100) * 0.3;

      // Inflation impact (negative)
      baseSales *= Math.max(0.5, 1 - inflationRate / 100);

      // Product value impact
      baseSales *= productValue;

      predictedSales = Math.max(0, Math.round(baseSales));
    }

    // RESTORED: Original confidence calculation
    if (location && Object.keys(location).length > 5) confidence += 0.1;
    if (brandPresence >= 7) confidence += 0.05;
    if (marketingSpend > 100) confidence += 0.05;
    confidence = Math.min(confidence, 0.98);

    // RESTORED: All original impact calculations
    const marketTierImpact = FEATURE_INTERPRETATIONS.marketTier(marketTier);
    const incomeImpact = FEATURE_INTERPRETATIONS.incomeLevel(incomeLevel);
    const infrastructureImpact =
      FEATURE_INTERPRETATIONS.infrastructureScore(infrastructureScore);
    const brandImpact = FEATURE_INTERPRETATIONS.brandPresence(brandPresence);
    const digitalizationImpact = 0.7 + (internetPenetration / 100) * 0.3;
    const economicImpact =
      Math.max(0.5, 1 - inflationRate / 100) *
      Math.min(1.5, monthlyExpenses / 500);

    return {
      predictedSales,
      confidence: Math.round(confidence * 100) / 100,
      marketTier,
      economicImpact: Math.round(economicImpact * 100) / 100,
      infrastructureImpact: Math.round(infrastructureImpact * 100) / 100,
      digitalizationImpact: Math.round(digitalizationImpact * 100) / 100,
      brandImpact: Math.round(brandImpact * 100) / 100,
      processingTime: Date.now() - startTime,
      predictionMethod, // NEW: Shows which method was used
    };
  } catch (error) {
    console.error("Prediction error:", error);
    throw new Error("Sales prediction failed: " + error.message);
  }
}

// Initialize model in background
loadPreTrainedModel().catch(console.warn);

export async function getModel() {
  return await loadPreTrainedModel();
}
