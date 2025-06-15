import React, { useState, useEffect } from "react";
import {
  ArrowPathIcon,
  ChartBarIcon,
  InformationCircleIcon,
  GlobeAltIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UsersIcon,
  HomeIcon,
  TruckIcon,
  WifiIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";


const SalesPredictor = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showAdvancedLocation, setShowAdvancedLocation] = useState(false);

  const API_KEY =
    process.env.NEXT_PUBLIC_LOCATION_API_KEY?.replace(/['"]/g, "") ||
    "cElFNTQwbkllYnk1eGd3RXd5a1dNbXV3aVhrZDNQTmxOTGZSbWloZQ==";

  const [formData, setFormData] = useState({
    category: "",
    productId: "",
    productName: "",
    basePrice: 0,
    day: "",
    marketingSpend: "",
    season: "summer",
    brandPresence: 5,
    location: {
      country: "",
      region: "",
      city: "",
      marketTier: 3,
      incomeLevel: 3,
      inflationRate: 2.5,
      monthlyExpenses: 1500,
      populationDensity: 2,
      urbanizationLevel: "urban",
      infrastructureScore: 7,
      internetPenetration: 75,
      isFestivalOrHoliday: false,
    },
    useLocation: false,
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  useEffect(() => {
    if (formData.location.country) {
      const fetchStates = async (countryIso) => {
        try {
          const headers = new Headers();
          headers.append("X-CSCAPI-KEY", API_KEY);

          const response = await fetch(
            `https://api.countrystatecity.in/v1/countries/${countryIso}/states`,
            { method: "GET", headers: headers, redirect: "follow" }
          );

          if (!response.ok) {
            console.error(
              `States API error: ${response.status} - ${response.statusText}`
            );
            setRegions([]);
            return;
          }

          const result = await response.json();
          setRegions(Array.isArray(result) ? result : []);
        } catch (error) {
          console.error("Error fetching states:", error);
          setRegions([]);
        }
      };

      fetchStates(formData.location.country);
    }
  }, [formData.location.country, API_KEY]);

  useEffect(() => {
    if (formData.location.country && formData.location.region) {
      const fetchCities = async (countryIso, regionIso) => {
        try {
          const headers = new Headers();
          headers.append("X-CSCAPI-KEY", API_KEY);

          const response = await fetch(
            `https://api.countrystatecity.in/v1/countries/${countryIso}/states/${regionIso}/cities`,
            { method: "GET", headers: headers, redirect: "follow" }
          );

          if (!response.ok) {
            console.error(
              `Cities API error: ${response.status} - ${response.statusText}`
            );
            setCities([]);
            return;
          }

          const result = await response.json();
          setCities(
            Array.isArray(result) ? result.map((city) => city.name) : []
          );
        } catch (error) {
          console.error("Error fetching cities:", error);
          setCities([]);
        }
      };

      fetchCities(formData.location.country, formData.location.region);
    } else {
      setCities([]);
    }
  }, [formData.location.country, formData.location.region, API_KEY]);

  const getBrandPresenceDescription = (score) => {
    const descriptions = {
      1: "Very Weak (1/10) - Minimal brand recognition",
      2: "Weak (2/10) - Low brand awareness",
      3: "Below Average (3/10) - Limited brand presence",
      4: "Below Average (4/10) - Developing brand recognition",
      5: "Average (5/10) - Moderate brand presence",
      6: "Above Average (6/10) - Good brand recognition",
      7: "Strong (7/10) - Well-established brand",
      8: "Very Strong (8/10) - High brand loyalty",
      9: "Excellent (9/10) - Dominant brand presence",
      10: "Market Leader (10/10) - Exceptional brand strength"
    };
    return descriptions[score] || `${score}/10`;
  };

  const getMarketTierDescription = (tier) => {
    const descriptions = {
      1: "Tier 1 - Major Global Market (NYC, London, Tokyo level)",
      2: "Tier 2 - Developed Urban Center (Large metropolitan areas)",
      3: "Tier 3 - Emerging Urban Market (Growing cities)",
      4: "Tier 4 - Developing Market (Smaller cities, developing regions)",
      5: "Tier 5 - Frontier Market (Rural or early-stage markets)"
    };
    return descriptions[tier] || `Tier ${tier}`;
  };

  const getIncomeLevelDescription = (level) => {
    const descriptions = {
      1: "Low Income Level - Limited purchasing power",
      2: "Medium Income Level - Moderate purchasing power",
      3: "High Income Level - Strong purchasing power"
    };
    return descriptions[level] || `Income Level ${level}`;
  };

  const getInfrastructureDescription = (score) => {
    if (score >= 8) return `Excellent Infrastructure (${score}/10) - Advanced logistics & connectivity`;
    if (score >= 6) return `Good Infrastructure (${score}/10) - Reliable logistics & connectivity`;
    if (score >= 4) return `Moderate Infrastructure (${score}/10) - Basic logistics & connectivity`;
    return `Poor Infrastructure (${score}/10) - Limited logistics & connectivity`;
  };

  const getInternetPenetrationDescription = (percentage) => {
    if (percentage >= 80) return `High Internet Access (${percentage}%) - Excellent digital reach`;
    if (percentage >= 60) return `Moderate Internet Access (${percentage}%) - Good digital reach`;
    if (percentage >= 40) return `Limited Internet Access (${percentage}%) - Moderate digital reach`;
    return `Low Internet Access (${percentage}%) - Limited digital reach`;
  };

  const getPopulationDensityDescription = (density) => {
    const descriptions = {
      1: "Low Population Density - Sparse population, rural characteristics",
      2: "Medium Population Density - Moderate population, suburban characteristics",
      3: "High Population Density - Dense population, urban characteristics"
    };
    return descriptions[density] || `Population Density Level ${density}`;
  };

  const getUrbanizationDescription = (level) => {
    const descriptions = {
      "urban": "Urban Area - City environment with high commercial activity",
      "suburban": "Suburban Area - Mixed residential/commercial environment",
      "rural": "Rural Area - Countryside with limited commercial infrastructure"
    };
    return descriptions[level] || level;
  };

  useEffect(() => {
    const generateInsights = async () => {
      if (!prediction) return;

      setInsightsLoading(true);
      try {
        let locationInfo = "";
        if (formData.useLocation && formData.location.country) {
          locationInfo = `
LOCATION & MARKET ANALYSIS:
- Location: ${formData.location.city ? formData.location.city + ", " : ""}${formData.location.region ? formData.location.region + ", " : ""}${formData.location.country}
- ${getMarketTierDescription(formData.location.marketTier)}
- ${getIncomeLevelDescription(formData.location.incomeLevel)}
- Inflation Rate: ${formData.location.inflationRate}% (${formData.location.inflationRate > 5 ? 'High' : formData.location.inflationRate > 2 ? 'Moderate' : 'Low'} inflation environment)
- Average Monthly Expenses: $${formData.location.monthlyExpenses} (Consumer spending capacity indicator)
- ${getUrbanizationDescription(formData.location.urbanizationLevel)}
- ${getPopulationDensityDescription(formData.location.populationDensity)}
- ${getInfrastructureDescription(formData.location.infrastructureScore)}
- ${getInternetPenetrationDescription(formData.location.internetPenetration)}
- Festival/Holiday Period: ${formData.location.isFestivalOrHoliday ? '🎉 YES - Special occasion period with increased spending' : 'NO - Regular shopping period'}`;
        }

        const prompt = `Act as a top retail strategist. Analyze the following comprehensive sales data for ${prediction.product}:

PRODUCT & BRAND ANALYSIS:
- Product: ${prediction.product} (${formData.category} category)
- Base Price: $${formData.basePrice}
- ${getBrandPresenceDescription(formData.brandPresence)}
- Season: ${formData.season.charAt(0).toUpperCase() + formData.season.slice(1)} (Day ${formData.day} of the month)
- Marketing Budget: $${formData.marketingSpend}

MARKET PERFORMANCE:
- Predicted Sales Volume: ${prediction.prediction} units
- Prediction Confidence: ${(prediction.confidence * 100).toFixed(1)}%
${prediction.categoryPopularity ? `- Category Market Popularity: ${prediction.categoryPopularity}/10 (${prediction.categoryPopularity >= 7 ? 'High demand category' : prediction.categoryPopularity >= 5 ? 'Moderate demand category' : 'Low demand category'})` : ''}
${prediction.competitionLevel ? `- Competition Intensity: ${prediction.competitionLevel}/10 (${prediction.competitionLevel >= 7 ? 'Highly competitive market' : prediction.competitionLevel >= 5 ? 'Moderately competitive market' : 'Low competition market'})` : ''}
${locationInfo}

Based on this comprehensive analysis, provide strategic insights covering:
1. Sales Performance Assessment
2. Key Success Factors & Challenges
3. Marketing & Pricing Optimization
4. Location-Specific Opportunities
5. Actionable Recommendations

Focus on practical, data-driven strategies that consider the specific market conditions and brand positioning.`;

        const response = await fetch("/api/ai/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (!response.ok) {
          throw new Error(`Insights API error: ${response.status}`);
        }

        const data = await response.json();
        setAiInsights(data.choices[0].message.content);
      } catch (error) {
        console.error("Insights generation failed:", error);
        setAiInsights("Failed to generate insights. Please try again.");
      } finally {
        setInsightsLoading(false);
      }
    };

    if (prediction) {
      generateInsights();
    }
  }, [prediction, formData]);

  useEffect(() => {
    fetch("/api/products/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to fetch categories", err));

    const fetchCountries = async () => {
      try {
        console.log("Using API Key:", API_KEY);

        const headers = new Headers();
        headers.append("X-CSCAPI-KEY", API_KEY);

        const requestOptions = {
          method: "GET",
          headers: headers,
          redirect: "follow",
        };

        const response = await fetch(
          "https://api.countrystatecity.in/v1/countries",
          requestOptions
        );

        console.log("Countries API Response Status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            `Countries API error: ${response.status} - ${response.statusText}`,
            errorText
          );

          const fallbackCountries = [
            { name: "United States", code: "US" },
            { name: "Canada", code: "CA" },
            { name: "United Kingdom", code: "GB" },
            { name: "Germany", code: "DE" },
            { name: "France", code: "FR" },
            { name: "Japan", code: "JP" },
            { name: "Australia", code: "AU" },
            { name: "India", code: "IN" },
          ];
          setCountries(fallbackCountries);
          return;
        }

        const result = await response.json();
        console.log("Countries API Response:", result);

        if (Array.isArray(result)) {
          const countryData = result.map((country) => ({
            name: country.name,
            code: country.iso2,
          }));
          setCountries(countryData);
        } else {
          console.error("Unexpected API response format:", result);
          setCountries([]);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
        const fallbackCountries = [
          { name: "United States", code: "US" },
          { name: "Canada", code: "CA" },
          { name: "United Kingdom", code: "GB" },
          { name: "Germany", code: "DE" },
          { name: "France", code: "FR" },
          { name: "Japan", code: "JP" },
          { name: "Australia", code: "AU" },
          { name: "India", code: "IN" },
        ];
        setCountries(fallbackCountries);
      }
    };

    fetchCountries();
  }, [API_KEY]);

  useEffect(() => {
    if (formData.category) {
      fetch(`/api/products?category=${formData.category}`)
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((err) => console.error("Failed to fetch products", err));
    } else {
      setProducts([]);
    }

    setFormData((prev) => ({
      ...prev,
      productId: "",
      productName: "",
      basePrice: 0,
    }));
    setFilteredProducts([]);
  }, [formData.category]);

  const handleProductNameChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, productName: value, productId: "" });

    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleCountryChange = (e) => {
    const countryIso = e.target.value;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        country: countryIso,
        region: "",
        city: "",
      },
    }));
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        city: value,
      },
    }));

    const filtered = cities.filter((c) =>
      c.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCities(filtered);
  };

  const selectProduct = (product) => {
    setFormData({
      ...formData,
      productId: product._id,
      productName: product.name,
      basePrice: product.basePrice,
    });
    setFilteredProducts([]);
  };

  const selectCity = (cityName) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        city: cityName,
      },
    }));
    setFilteredCities([]);
  };

  const handleRegionChange = (e) => {
    const regionIso = e.target.value;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        region: regionIso,
        city: "",
      },
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('=== SALES PREDICTOR FORM DATA ===');
    console.log('Product Information:');
    console.log('- Category:', formData.category);
    console.log('- Product ID:', formData.productId);
    console.log('- Product Name:', formData.productName);
    console.log('- Base Price:', formData.basePrice);
    console.log('- Brand Presence:', formData.brandPresence);

    console.log('\nSales Parameters:');
    console.log('- Day:', formData.day);
    console.log('- Marketing Spend:', formData.marketingSpend);
    console.log('- Season:', formData.season);

    console.log('\nLocation Settings:');
    console.log('- Use Location:', formData.useLocation);

    if (formData.useLocation) {
      console.log('- Country:', formData.location.country);
      console.log('- Region:', formData.location.region);
      console.log('- City:', formData.location.city);
      console.log('- Market Tier:', formData.location.marketTier);
      console.log('- Income Level:', formData.location.incomeLevel);
      console.log('- Inflation Rate:', formData.location.inflationRate + '%');
      console.log('- Monthly Expenses:', '$' + formData.location.monthlyExpenses);
      console.log('- Population Density:', formData.location.populationDensity);
      console.log('- Urbanization Level:', formData.location.urbanizationLevel);
      console.log('- Infrastructure Score:', formData.location.infrastructureScore + '/10');
      console.log('- Internet Penetration:', formData.location.internetPenetration + '%');
      console.log('- Festival/Holiday Period:', formData.location.isFestivalOrHoliday);
    }

    console.log('\nComplete Form Data Object:');
    console.log(JSON.stringify(formData, null, 2));
    console.log('=====================================');

    setLoading(true);
    setPrediction(null);

    try {
      const requestBody = {
        ...formData,
        location: formData.useLocation ? formData.location : undefined,
      };

      const response = await fetch("/api/predict-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Prediction API error: ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      console.error("Prediction error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 md:p-8 flex">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-8">

        <div className="w-full md:w-1/2 lg:w-1/3 bg-white rounded-2xl shadow-xl p-6 md:p-8 h-fit md:sticky md:top-8 transition-all duration-300">
          <div className="mb-8 flex items-center gap-3">
            <ChartBarIcon className="h-8 w-8 text-blue-600 transform transition-transform duration-500 hover:rotate-12" />
            <h2 className="text-2xl font-bold text-gray-800 font-[Poppins] bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Advanced Sales Forecaster
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-700 border-b pb-2">
                Product Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    Category
                    <InformationCircleIcon className="w-4 h-4 text-gray-400" />
                  </label>
                  <select
                    className="w-full bg-gray-100 rounded-lg border border-gray-300 px-4 py-2.5 text-base 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 
                    transition-all duration-200"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 relative">
                  <label className="text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full bg-gray-100 rounded-lg border border-gray-300 px-4 py-2.5 text-base
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400
                      transition-all duration-200 disabled:opacity-50"
                      value={formData.productName}
                      onChange={handleProductNameChange}
                      disabled={!formData.category}
                      required
                    />
                    {filteredProducts.length > 0 && (
                      <div
                        className="absolute z-50 w-full mt-1.5 bg-white shadow-xl rounded-lg 
                      max-h-60 overflow-auto border border-gray-200"
                      >
                        {filteredProducts.map((p) => (
                          <div
                            key={p._id}
                            onClick={() => selectProduct(p)}
                            className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors
                            text-sm text-gray-700 flex justify-between items-center"
                          >
                            <span>{p.name}</span>
                            <span className="text-blue-600 font-medium">
                              ${p.basePrice}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  Base Price
                  <CurrencyDollarIcon className="w-4 h-4 text-green-500" />
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full bg-gray-100 rounded-lg border border-gray-300 pl-8 pr-4 py-2.5 
                    text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    hover:border-blue-400 transition-all duration-200"
                    value={formData.basePrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        basePrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  Brand Presence in Region (1-10)
                  <InformationCircleIcon className="w-4 h-4 text-gray-400" />
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  className="w-full accent-blue-600"
                  value={formData.brandPresence}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      brandPresence: parseInt(e.target.value),
                    })
                  }
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Weak (1)</span>
                  <span className="font-medium">
                    {formData.brandPresence}/10
                  </span>
                  <span>Strong (10)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-700 border-b pb-2">
                Sales Parameters
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Day of Month
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    className="w-full bg-gray-100 rounded-lg border border-gray-300 px-4 py-2.5 text-base
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400
                    transition-all duration-200"
                    value={formData.day}
                    onChange={(e) =>
                      setFormData({ ...formData, day: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    Marketing Budget
                    <InformationCircleIcon className="w-4 h-4 text-gray-400" />
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      step="50"
                      className="w-full bg-gray-100 rounded-lg border border-gray-300 pl-8 pr-4 py-2.5 
                      text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                      hover:border-blue-400 transition-all duration-200"
                      value={formData.marketingSpend}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          marketingSpend: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Season
                  </label>
                  <select
                    className="w-full bg-gray-100 rounded-lg border border-gray-300 px-4 py-2.5 text-base
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400
                    transition-all duration-200"
                    value={formData.season}
                    onChange={(e) =>
                      setFormData({ ...formData, season: e.target.value })
                    }
                  >
                    {["winter", "spring", "summer", "fall"].map((season) => (
                      <option key={season} value={season}>
                        {season.charAt(0).toUpperCase() + season.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-md font-medium text-gray-700">
                  Location Data
                </h3>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.useLocation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        useLocation: e.target.checked,
                      })
                    }
                  />
                  <div
                    className="relative w-11 h-6 bg-gray-300 peer-checked:bg-blue-500 rounded-full peer peer-checked:after:translate-x-full 
                  after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 
                  after:transition-all transition-colors duration-300"
                  ></div>
                  <span className="ml-2 text-sm font-medium text-gray-600">
                    {formData.useLocation ? "Enabled" : "Disabled"}
                  </span>
                </label>
              </div>

              {formData.useLocation && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <GlobeAltIcon className="w-4 h-4 text-blue-500" />
                        Country
                      </label>
                      <select
                        className="w-full bg-gray-100 rounded-lg border border-gray-300 px-4 py-2.5 text-base
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400
                        transition-all duration-200"
                        value={formData.location.country}
                        onChange={handleCountryChange}
                        required={formData.useLocation}
                      >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Region/State
                      </label>
                      <select
                        className="w-full bg-gray-100 rounded-lg border border-gray-300 px-4 py-2.5 text-base
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400
                        transition-all duration-200 disabled:opacity-50"
                        value={formData.location.region}
                        onChange={handleRegionChange}
                        disabled={!formData.location.country}
                        required={formData.useLocation}
                      >
                        <option value="">Select Region</option>
                        {regions.map((region) => (
                          <option key={region.iso2} value={region.iso2}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4 text-red-500" />
                        City
                      </label>
                      <select
                        className="w-full bg-gray-100 rounded-lg border border-gray-300 px-4 py-2.5 text-base
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400
    transition-all duration-200 disabled:opacity-50"
                        value={formData.location.city}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            location: {
                              ...prev.location,
                              city: e.target.value,
                            },
                          }))
                        }
                        disabled={
                          !formData.location.region || cities.length === 0
                        }
                        required={formData.useLocation}
                      >
                        <option value="">
                          {cities.length === 0
                            ? formData.location.region
                              ? "Loading cities..."
                              : "Select region first"
                            : "Select City"}
                        </option>
                        {cities.map((city, index) => (
                          <option key={index} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        Market Tier
                        <InformationCircleIcon className="w-4 h-4 text-gray-400" />
                      </label>
                      <div className="relative">
                        <select
                          className="w-full bg-gray-100 rounded-lg border border-gray-300 px-4 py-2.5 text-base
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400
                          transition-all duration-200"
                          value={formData.location.marketTier}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: {
                                ...formData.location,
                                marketTier: parseInt(e.target.value),
                              },
                            })
                          }
                        >
                          {[1, 2, 3, 4, 5].map((tier) => (
                            <option key={tier} value={tier}>
                              Tier {tier} - {getMarketTierDescription(tier)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                      onClick={() =>
                        setShowAdvancedLocation(!showAdvancedLocation)
                      }
                    >
                      {showAdvancedLocation ? "Hide" : "Show"} Advanced Location
                      Parameters
                      <svg
                        className={`w-4 h-4 ml-1 transition-transform ${showAdvancedLocation ? "rotate-180" : ""
                          }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>

                  {showAdvancedLocation && (
                    <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 border-b pb-2">
                        Economic Indicators
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                            <CurrencyDollarIcon className="w-4 h-4 text-green-500" />
                            Income Level
                          </label>
                          <select
                            className="w-full bg-white rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            value={formData.location.incomeLevel}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                location: {
                                  ...formData.location,
                                  incomeLevel: parseInt(e.target.value),
                                },
                              })
                            }
                          >
                            <option value={1}>Low Income</option>
                            <option value={2}>Medium Income</option>
                            <option value={3}>High Income</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                            <svg
                              className="w-4 h-4 text-red-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Inflation Rate (%)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="50"
                            step="0.1"
                            className="w-full bg-white rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            value={formData.location.inflationRate}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                location: {
                                  ...formData.location,
                                  inflationRate: parseFloat(e.target.value),
                                },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                            <HomeIcon className="w-4 h-4 text-purple-500" />
                            Avg Monthly Expenses (USD)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="10000"
                            step="100"
                            className="w-full bg-white rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            value={formData.location.monthlyExpenses}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                location: {
                                  ...formData.location,
                                  monthlyExpenses: parseFloat(e.target.value),
                                },
                              })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                            <UsersIcon className="w-4 h-4 text-blue-500" />
                            Population Density
                          </label>
                          <select
                            className="w-full bg-white rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            value={formData.location.populationDensity}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                location: {
                                  ...formData.location,
                                  populationDensity: parseInt(e.target.value),
                                },
                              })
                            }
                          >
                            <option value={1}>Low</option>
                            <option value={2}>Medium</option>
                            <option value={3}>High</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                            <svg
                              className="w-4 h-4 text-gray-700"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                              />
                            </svg>
                            Urbanization Level
                          </label>
                          <select
                            className="w-full bg-white rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            value={formData.location.urbanizationLevel}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                location: {
                                  ...formData.location,
                                  urbanizationLevel: e.target.value,
                                },
                              })
                            }
                          >
                            <option value="urban">Urban</option>
                            <option value="suburban">Suburban</option>
                            <option value="rural">Rural</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                            <TruckIcon className="w-4 h-4 text-orange-500" />
                            Infrastructure Score (1-10)
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            step="0.5"
                            className="w-full accent-blue-600"
                            value={formData.location.infrastructureScore}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                location: {
                                  ...formData.location,
                                  infrastructureScore: parseFloat(
                                    e.target.value
                                  ),
                                },
                              })
                            }
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Poor (1)</span>
                            <span className="font-medium">
                              {formData.location.infrastructureScore}/10
                            </span>
                            <span>Excellent (10)</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                            <WifiIcon className="w-4 h-4 text-indigo-500" />
                            Internet Penetration (%)
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            className="w-full accent-indigo-600"
                            value={formData.location.internetPenetration}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                location: {
                                  ...formData.location,
                                  internetPenetration: parseInt(e.target.value),
                                },
                              })
                            }
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Low (0%)</span>
                            <span className="font-medium">
                              {formData.location.internetPenetration}%
                            </span>
                            <span>High (100%)</span>
                          </div>
                        </div>

                        <div className="space-y-2 flex items-center pt-3">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={formData.location.isFestivalOrHoliday}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  location: {
                                    ...formData.location,
                                    isFestivalOrHoliday: e.target.checked,
                                  },
                                })
                              }
                            />
                            <div
                              className="relative w-11 h-6 bg-gray-300 peer-checked:bg-yellow-500 rounded-full peer peer-checked:after:translate-x-full 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 
                            after:transition-all transition-colors duration-300"
                            ></div>
                            <span className="ml-2 text-xs font-medium text-gray-600 flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4 text-yellow-500" />
                              Festival/Holiday Period
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-blue-600 to-purple-600 text-white py-3.5 px-6 rounded-xl font-medium 
                hover:shadow-lg transition-all duration-300 disabled:opacity-70 
                disabled:hover:bg-blue-600 disabled:cursor-not-allowed flex items-center 
                justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin transition-transform duration-150" />
                  <span>Analyzing Data...</span>
                </>
              ) : (
                <>
                  <span className="transform transition-transform duration-300 group-hover:scale-105">
                    Generate Forecast
                  </span>
                  <svg
                    className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="w-full md:w-1/2 lg:w-2/3 flex flex-col gap-8">
          {prediction && (
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 sticky top-8 animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <ChartBarIcon className="w-6 h-6 text-green-600" />
                  {prediction.product} Forecast
                </h3>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {(prediction.confidence * 100).toFixed(1)}% Confidence
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Predicted Sales</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {prediction.prediction}
                      <span className="text-lg text-gray-600 ml-1">units</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {formData.season.charAt(0).toUpperCase() +
                        formData.season.slice(1)}{" "}
                      Season
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      Day {formData.day}
                      <sup className="ml-0.5">
                        {["st", "nd", "rd"][
                          ((((formData.day + 90) % 100) - 10) % 10) - 1
                        ] || "th"}
                      </sup>
                    </p>
                    {formData.useLocation && formData.location.country && (
                      <p className="text-xs text-blue-600 mt-1">
                        {formData.location.city
                          ? formData.location.city + ", "
                          : ""}
                        {formData.location.region
                          ? formData.location.region + ", "
                          : ""}
                        {formData.location.country}
                      </p>
                    )}
                  </div>
                </div>

                {prediction.categoryPopularity &&
                  prediction.competitionLevel && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">
                          Category Popularity
                        </p>
                        <div className="flex items-center mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{
                                width: `${prediction.categoryPopularity * 10}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium ml-2">
                            {prediction.categoryPopularity}/10
                          </span>
                        </div>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">
                          Competition Level
                        </p>
                        <div className="flex items-center mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-orange-500 h-2 rounded-full"
                              style={{
                                width: `${prediction.competitionLevel * 10}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium ml-2">
                            {prediction.competitionLevel}/10
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                {formData.useLocation && prediction && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-gray-50 p-2 rounded-lg flex items-center gap-2">
                      <CurrencyDollarIcon className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-xs text-gray-500">Income</p>
                        <p className="text-sm font-medium">
                          {getIncomeLevelDescription(
                            formData.location.incomeLevel
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Inflation</p>
                        <p className="text-sm font-medium">
                          {formData.location.inflationRate}%
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg flex items-center gap-2">
                      <WifiIcon className="w-5 h-5 text-indigo-500" />
                      <div>
                        <p className="text-xs text-gray-500">Internet Access</p>
                        <p className="text-sm font-medium">
                          {formData.location.internetPenetration}%
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg flex items-center gap-2">
                      <TruckIcon className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="text-xs text-gray-500">Infrastructure</p>
                        <p className="text-sm font-medium">
                          {formData.location.infrastructureScore}/10
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    AI-Powered Insights
                  </h4>

                  <div className="relative h-[calc(100vh-400px)] overflow-y-auto pr-4">
                    {insightsLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center space-y-4 animate-pulse">
                        <div className="w-full space-y-4">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="h-4 bg-gray-200 rounded-full w-full"
                            />
                          ))}
                        </div>
                      </div>
                    ) : aiInsights ? (
                      <p className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                        <ReactMarkdown>
                          {aiInsights}
                        </ReactMarkdown>
                      </p>

                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Insights generation failed. Please try again.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!prediction && (
            <div className="h-full flex items-center justify-center bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
              <div className="text-center space-y-4">
                <div className="inline-block p-4 bg-blue-50 rounded-full">
                  <ChartBarIcon className="w-12 h-12 text-blue-600 transform rotate-12" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Generate Your First Forecast
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Enter product details and marketing parameters to get
                  AI-powered sales predictions and strategic insights based on
                  economic and demographic factors.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesPredictor;
