import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  MapPin,
  Target,
  Users,
  Wifi,
  ShoppingBag,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Calendar,
  Star,
  Globe,
  Activity,
  Zap,
  Filter,
  ArrowUpDown,
  RefreshCw,
  LayoutDashboard,
  List,
  BrainCircuit,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

export const SalesAnalyticsDashboard = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});
  const [displayedItems, setDisplayedItems] = useState(4);
  const [showAll, setShowAll] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "predictedSales",
    direction: "desc",
  });
  const [timeFilter, setTimeFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [insights, setInsights] = useState("");
  const [loadingInsights, setLoadingInsights] = useState(false);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const token = localStorage && localStorage.getItem("token");
      const res = await fetch("/api/predictions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error(
          "Expected an array of predictions but got something else."
        );
      }

      setPredictions(data);
    } catch (error) {
      console.error("Error fetching predictions:", error);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    try {
      setLoadingInsights(true);
      const token = localStorage.getItem("token");

      const totalPredictedSales = predictions.reduce(
        (sum, p) => sum + p.predictedSales,
        0
      );

      const totalRevenue = predictions.reduce(
        (sum, p) => sum + p.predictedSales * p.basePrice,
        0
      );

      const topProducts = [...predictions]
        .sort(
          (a, b) =>
            b.predictedSales * b.basePrice - a.predictedSales * a.basePrice
        )
        .slice(0, 3)
        .map((p) => p.productName);

      const response = await fetch("/api/ai/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
               content: `As a Chief Strategy Officer, generate clear, actionable insights from our sales predictions data using simple language that anyone can understand. Avoid business jargon and complex terminology and repititive data.

**Core Business Metrics** (Reference only):
- Predicted sales: ${totalPredictedSales.toLocaleString()} units
- Projected revenue: ${formatCurrency(totalRevenue)}
- Top products: ${topProducts.join(", ")}
- Products analyzed: ${predictions.length}

**Please provide insights in this simple format**:

## What's Working Well
- [2-3 positive trends (professional, guided, helpful and relevant) in plain language]

## Key Opportunities
- [2-3 clear areas for improvement but professional and relevant]

## Recommended Actions
- [3-4 simple, actionable steps but professional and relevant]

## Watch Out For
- [2-3 potential risks in simple terms but professional and relevant]

**Writing Requirements**:
- Use everyday language (explain like I'm a smart 15-year-old)
- Keep sentences under 15 words
- Use bullet points only (no paragraphs)
- Avoid percentages and complex metrics
- Focus on what matters most in simple terms
- Be direct and practical`,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.error?.message ||
          `Failed to fetch insights: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data.choices?.[0]?.message?.content) {
        throw new Error("Invalid insights response format");
      }

      setInsights(data.choices[0].message.content);
    } catch (error) {
      console.error("Error fetching insights:", error);
      setInsights(`Error: ${error.message || "Failed to load insights"}`);
    } finally {
      setLoadingInsights(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  useEffect(() => {
    if (activeTab === "insights" && predictions.length > 0 && !insights) {
      fetchInsights();
    }
  }, [activeTab, predictions]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const toggleCardExpansion = (cardId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const handleLoadMore = () => {
    if (showAll) {
      setDisplayedItems(4);
      setShowAll(false);
      setExpandedCards({});
    } else {
      setDisplayedItems(predictions.length);
      setShowAll(true);
    }
  };

  const getBrandPresenceDescription = (score) => {
    const descriptions = {
      1: "Very Weak",
      2: "Weak",
      3: "Below Average",
      4: "Below Average",
      5: "Average",
      6: "Above Average",
      7: "Strong",
      8: "Very Strong",
      9: "Excellent",
      10: "Market Leader",
    };
    return descriptions[score] || `${score}/10`;
  };

  const getMarketTierDescription = (tier) => {
    const descriptions = {
      1: "Major Global Market",
      2: "Developed Urban Center",
      3: "Emerging Urban Market",
      4: "Developing Market",
      5: "Frontier Market",
    };
    return descriptions[tier] || `Tier ${tier}`;
  };

  const getIncomeLevelDescription = (level) => {
    const descriptions = {
      1: "Low Income",
      2: "Medium Income",
      3: "High Income",
    };
    return descriptions[level] || `Level ${level}`;
  };

  const getPopulationDensityDescription = (density) => {
    const descriptions = {
      1: "Low Density",
      2: "Medium Density",
      3: "High Density",
    };
    return descriptions[density] || `Density ${density}`;
  };

  const getUrbanizationDescription = (level) => {
    const descriptions = {
      urban: "Urban Area",
      suburban: "Suburban Area",
      rural: "Rural Area",
    };
    return descriptions[level] || level;
  };

  const getSeasonIcon = (season) => {
    const seasonIcons = {
      spring: "🌸",
      summer: "☀️",
      autumn: "🍂",
      winter: "❄️",
    };
    return seasonIcons[season] || "📅";
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return "from-emerald-500 to-emerald-600";
    if (confidence >= 0.7) return "from-blue-500 to-blue-600";
    return "from-amber-500 to-amber-600";
  };

  const handleSort = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  const filteredPredictions = useMemo(() => {
    return predictions
      .filter((prediction) => {
        const predictionDate = new Date(prediction.createdAt);
        const now = new Date();
        const timeDiff = now - predictionDate;
        const daysDiff = timeDiff / (1000 * 3600 * 24);

        if (timeFilter === "week" && daysDiff > 7) return false;
        if (timeFilter === "month" && daysDiff > 30) return false;

        if (
          regionFilter !== "all" &&
          prediction.location.region !== regionFilter
        )
          return false;

        return true;
      })
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
  }, [predictions, sortConfig, timeFilter, regionFilter]);

  const totalPredictedSales = filteredPredictions.reduce(
    (sum, p) => sum + p.predictedSales,
    0
  );

  const avgConfidence =
    filteredPredictions.length > 0
      ? filteredPredictions.reduce((sum, p) => sum + p.confidence, 0) /
        filteredPredictions.length
      : 0;

  const totalRevenue = filteredPredictions.reduce(
    (sum, p) => sum + p.predictedSales * p.basePrice,
    0
  );

  const salesByRegionData = useMemo(() => {
    const regionMap = {};

    filteredPredictions.forEach((prediction) => {
      const region = prediction.location.region;
      if (!regionMap[region]) {
        regionMap[region] = {
          name: region,
          sales: 0,
          revenue: 0,
        };
      }

      regionMap[region].sales += prediction.predictedSales;
      regionMap[region].revenue +=
        prediction.predictedSales * prediction.basePrice;
    });

    return Object.values(regionMap).sort((a, b) => b.revenue - a.revenue);
  }, [filteredPredictions]);

  const salesByProductData = useMemo(() => {
    const productMap = {};

    filteredPredictions.forEach((prediction) => {
      const productName = prediction.productName;
      if (!productMap[productName]) {
        productMap[productName] = {
          name: productName,
          sales: 0,
          revenue: 0,
          confidence: 0,
          count: 0,
        };
      }

      productMap[productName].sales += prediction.predictedSales;
      productMap[productName].revenue +=
        prediction.predictedSales * prediction.basePrice;
      productMap[productName].confidence += prediction.confidence;
      productMap[productName].count += 1;
    });

    return Object.values(productMap)
      .map((p) => ({
        ...p,
        avgConfidence: p.confidence / p.count,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredPredictions]);

  const confidenceDistribution = useMemo(() => {
    const buckets = {
      "High (90-100%)": 0,
      "Good (70-89%)": 0,
      "Medium (50-69%)": 0,
      "Low (<50%)": 0,
    };

    filteredPredictions.forEach((prediction) => {
      const confidence = prediction.confidence * 100;
      if (confidence >= 90) buckets["High (90-100%)"]++;
      else if (confidence >= 70) buckets["Good (70-89%)"]++;
      else if (confidence >= 50) buckets["Medium (50-69%)"]++;
      else buckets["Low (<50%)"]++;
    });

    return Object.entries(buckets).map(([name, value]) => ({
      name,
      value,
    }));
  }, [filteredPredictions]);

  const timeSeriesData = useMemo(() => {
    const dailyData = {};

    filteredPredictions.forEach((prediction) => {
      const date = new Date(prediction.createdAt).toISOString().split("T")[0];
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          sales: 0,
          revenue: 0,
        };
      }

      dailyData[date].sales += prediction.predictedSales;
      dailyData[date].revenue +=
        prediction.predictedSales * prediction.basePrice;
    });

    return Object.values(dailyData)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7);
  }, [filteredPredictions]);

  const COLORS = ["#9F7AEA", "#667EEA", "#ED64A6", "#38B2AC", "#F6AD55"];

  const DashboardTab = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-purple-200 text-xs sm:text-sm font-medium">
                TOTAL SALES
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                {totalPredictedSales.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20 hover:border-emerald-400/50 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-purple-200 text-xs sm:text-sm font-medium">
                REVENUE
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20 hover:border-orange-400/50 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-purple-200 text-xs sm:text-sm font-medium">
                CONFIDENCE
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                {Math.round(avgConfidence * 100)}%
              </p>
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-purple-200 text-xs sm:text-sm font-medium">
                PRODUCTS
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                {filteredPredictions.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" /> Sales Trend (Last
            7 Days)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={timeSeriesData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#6b46c1"
                  strokeOpacity={0.2}
                />
                <XAxis
                  dataKey="date"
                  stroke="#cbd5e0"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke="#cbd5e0"
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2D3748",
                    borderColor: "#6B46C1",
                    borderRadius: "0.5rem",
                    backdropFilter: "blur(10px)",
                  }}
                  formatter={(value) => [value.toLocaleString(), "Sales"]}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#8884d8"
                  fill="url(#colorSales)"
                  fillOpacity={0.8}
                />
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-400" /> Revenue by Region
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesByRegionData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#6b46c1"
                  strokeOpacity={0.2}
                />
                <XAxis
                  dataKey="name"
                  stroke="#cbd5e0"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke="#cbd5e0"
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2D3748",
                    borderColor: "#6B46C1",
                    borderRadius: "0.5rem",
                    backdropFilter: "blur(10px)",
                  }}
                  formatter={(value) => [formatCurrency(value), "Revenue"]}
                />
                <Bar dataKey="revenue" name="Revenue" radius={[4, 4, 0, 0]}>
                  {salesByRegionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-400" /> Top Performing
            Products
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesByProductData}
                layout="vertical"
                margin={{
                  top: 20,
                  right: 30,
                  left: 100,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#6b46c1"
                  strokeOpacity={0.2}
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  stroke="#cbd5e0"
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#cbd5e0"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2D3748",
                    borderColor: "#6B46C1",
                    borderRadius: "0.5rem",
                    backdropFilter: "blur(10px)",
                  }}
                  formatter={(value) => [formatCurrency(value), "Revenue"]}
                />
                <Bar dataKey="revenue" name="Revenue" radius={[0, 4, 4, 0]}>
                  {salesByProductData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" /> Confidence
            Distribution
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={confidenceDistribution.filter((item) => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {confidenceDistribution
                    .filter((item) => item.value > 0)
                    .map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2D3748",
                    borderColor: "#6B46C1",
                    borderRadius: "0.5rem",
                    backdropFilter: "blur(10px)",
                  }}
                  formatter={(value) => [value, "Predictions"]}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ fontSize: "12px", color: "#cbd5e0" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );

  const PredictionsTab = () => (
    <>
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-purple-200 text-sm font-medium mb-2 block">
              Time Range
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setTimeFilter("all")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  timeFilter === "all"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-white/5 text-purple-200 hover:bg-white/10"
                }`}
              >
                All Time
              </button>
              <button
                onClick={() => setTimeFilter("month")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  timeFilter === "month"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-white/5 text-purple-200 hover:bg-white/10"
                }`}
              >
                Last Month
              </button>
              <button
                onClick={() => setTimeFilter("week")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  timeFilter === "week"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-white/5 text-purple-200 hover:bg-white/10"
                }`}
              >
                Last Week
              </button>
            </div>
          </div>

          <div>
            <label className="text-purple-200 text-sm font-medium mb-2 block">
              Region
            </label>
            <div className="relative">
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
              >
                <option value="all">All Regions</option>
                {[
                  ...new Set(filteredPredictions.map((p) => p.location.region)),
                ].map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-purple-200 text-sm font-medium mb-2 block">
              Sort By
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => handleSort("predictedSales")}
                className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1 ${
                  sortConfig.key === "predictedSales"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-white/5 text-purple-200 hover:bg-white/10"
                }`}
              >
                Sales
                {sortConfig.key === "predictedSales" && (
                  <ArrowUpDown className="w-3 h-3" />
                )}
              </button>
              <button
                onClick={() => handleSort("confidence")}
                className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1 ${
                  sortConfig.key === "confidence"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-white/5 text-purple-200 hover:bg-white/10"
                }`}
              >
                Confidence
                {sortConfig.key === "confidence" && (
                  <ArrowUpDown className="w-3 h-3" />
                )}
              </button>
              <button
                onClick={() => handleSort("createdAt")}
                className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1 ${
                  sortConfig.key === "createdAt"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-white/5 text-purple-200 hover:bg-white/10"
                }`}
              >
                Date
                {sortConfig.key === "createdAt" && (
                  <ArrowUpDown className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8 items-start">
        {filteredPredictions
          .slice(0, displayedItems)
          .map((prediction, index) => {
            const isExpanded = expandedCards[prediction._id];
            return (
              <div
                key={prediction._id}
                className="group relative self-start bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-[1.02] overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`bg-gradient-to-r ${getConfidenceColor(
                    prediction.confidence
                  )} p-4 sm:p-6 text-white`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold mb-2 truncate">
                        {prediction.productName}
                      </h3>
                      <div className="flex items-center gap-2 text-sm opacity-90">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">
                          {new Date(prediction.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold mb-1">
                        {prediction.predictedSales.toLocaleString()}
                      </p>
                      <p className="text-sm opacity-90">Predicted Units</p>
                    </div>
                    <div className="text-right">
                      <div className="bg-white/20 px-3 py-1 rounded-full">
                        <span className="text-sm font-semibold">
                          {Math.round(prediction.confidence * 100)}%
                        </span>
                      </div>
                      <p className="text-xs opacity-75 mt-1">Confidence</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg border border-emerald-500/30">
                      <DollarSign className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                      <p className="text-xs text-purple-200 mb-1">Base Price</p>
                      <p className="text-sm sm:text-base font-bold text-white">
                        {formatCurrency(prediction.basePrice)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
                      <TrendingUp className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                      <p className="text-xs text-purple-200 mb-1">Revenue</p>
                      <p className="text-sm sm:text-base font-bold text-white">
                        {formatCurrency(
                          prediction.predictedSales * prediction.basePrice
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-gradient-to-br from-white/5 to-white/10 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-purple-200">
                        Location
                      </span>
                    </div>
                    <p className="text-white font-medium text-sm sm:text-base">
                      {prediction.location.city}, {prediction.location.region}
                    </p>
                    <p className="text-purple-300 text-sm">
                      {prediction.location.country}
                    </p>
                  </div>

                  <div
                    className={`transition-all duration-500 overflow-hidden ${
                      isExpanded
                        ? "max-h-[1000px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="p-3 bg-gradient-to-br from-white/5 to-white/10 rounded-lg border border-white/10">
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
                          <Globe className="w-4 h-4 text-purple-400" />
                          Market Intelligence
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="flex justify-between p-2 bg-white/5 rounded">
                            <span className="text-purple-200">Market Tier</span>
                            <span className="text-white font-medium text-right">
                              {getMarketTierDescription(
                                prediction.location.marketTier
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between p-2 bg-white/5 rounded">
                            <span className="text-purple-200">
                              Income Level
                            </span>
                            <span className="text-white font-medium">
                              {getIncomeLevelDescription(
                                prediction.location.incomeLevel
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between p-2 bg-white/5 rounded">
                            <span className="text-purple-200">Population</span>
                            <span className="text-white font-medium">
                              {getPopulationDensityDescription(
                                prediction.location.populationDensity
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between p-2 bg-white/5 rounded">
                            <span className="text-purple-200">Area Type</span>
                            <span className="text-white font-medium">
                              {getUrbanizationDescription(
                                prediction.location.urbanizationLevel
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                          <Zap className="w-4 h-4 text-purple-400 mb-1" />
                          <p className="text-xs text-purple-200 mb-1">
                            Marketing
                          </p>
                          <p className="text-sm font-bold text-white">
                            {formatCurrency(prediction.marketingSpend)}
                          </p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
                          <Activity className="w-4 h-4 text-orange-400 mb-1" />
                          <p className="text-xs text-purple-200 mb-1">
                            Campaign
                          </p>
                          <p className="text-sm font-bold text-white">
                            Day {prediction.day}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 bg-gradient-to-br from-white/5 to-white/10 rounded-lg border border-white/10">
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
                          <Star className="w-4 h-4 text-yellow-400" />
                          Additional Details
                        </h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                            <span className="text-purple-200 flex items-center gap-2">
                              {getSeasonIcon(prediction.season)} Season
                            </span>
                            <span className="text-white font-medium capitalize">
                              {prediction.season}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                            <span className="text-purple-200">
                              Brand Presence
                            </span>
                            <span className="text-white font-medium">
                              {getBrandPresenceDescription(
                                prediction.brandPresence
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                            <span className="text-purple-200 flex items-center gap-1">
                              <Wifi className="w-3 h-3" />
                              Internet
                            </span>
                            <span className="text-white font-medium">
                              {prediction.location.internetPenetration}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                            <span className="text-purple-200">Inflation</span>
                            <span className="text-white font-medium">
                              {prediction.location.inflationRate}%
                            </span>
                          </div>
                          {prediction.location.isFestivalOrHoliday && (
                            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-2 rounded border border-yellow-500/30">
                              <span className="text-yellow-300 font-medium text-xs">
                                🎉 Festival/Holiday Active
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleCardExpansion(prediction._id)}
                    className="w-full mt-4 p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 rounded-lg border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 flex items-center justify-center gap-2 text-white font-medium"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Show Details
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {filteredPredictions.length > 4 && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {showAll
              ? "Show Less"
              : `Load More (${filteredPredictions.length - 4} remaining)`}
          </button>
        </div>
      )}
    </>
  );

  const InsightsTab = () => (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
          <BrainCircuit className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">
            AI-Powered Sales Insights
          </h2>
          <p className="text-purple-200">
            Strategic analysis of your sales predictions
          </p>
        </div>
      </div>

      {loadingInsights ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-blue-500 rounded-full animate-spin animate-reverse"></div>
          </div>
          <p className="text-lg text-purple-300">Generating insights...</p>
        </div>
      ) : (
        <div className="prose prose-invert max-w-none prose-headings:text-purple-300 prose-headings:mb-4 prose-p:my-3 prose-ul:my-4 prose-li:my-2">
          <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/30">
            {insights ? (
              <>
                <div className="insights-content text-white">
                  <ReactMarkdown>{insights}</ReactMarkdown>
                </div>

                <button
                  onClick={fetchInsights}
                  className="mt-6 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-lg flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Refresh Insights
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-purple-200 mb-4">
                  No insights generated yet
                </p>
                <button
                  onClick={fetchInsights}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-lg flex items-center gap-2 mx-auto"
                >
                  Generate Insights
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
            <BarChart3 className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-2">
            Sales Analytics Hub
          </h1>
          <p className="text-purple-200 text-lg">
            Advanced predictive insights for strategic decision making
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex gap-2 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl p-1 border border-white/20">
            {[
              {
                id: "dashboard",
                label: "Dashboard",
                icon: <LayoutDashboard className="w-4 h-4" />,
              },
              {
                id: "predictions",
                label: "Predictions",
                icon: <List className="w-4 h-4" />,
              },
              {
                id: "insights",
                label: "AI Insights",
                icon: <BrainCircuit className="w-4 h-4" />,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "text-purple-200 hover:bg-white/10"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-blue-500 rounded-full animate-spin animate-reverse"></div>
              </div>
              <p className="text-xl text-white font-semibold animate-pulse">
                Loading Analytics
              </p>
            </div>
          </div>
        ) : predictions.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-8">
              <ShoppingBag className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              No Analytics Available
            </h2>
            <p className="text-purple-200 mb-6">
              Generate predictions to unlock powerful insights
            </p>
            <button
              onClick={fetchPredictions}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" /> Refresh Data
            </button>
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && <DashboardTab />}
            {activeTab === "predictions" && <PredictionsTab />}
            {activeTab === "insights" && <InsightsTab />}
          </>
        )}
      </div>
    </div>
  );
};
