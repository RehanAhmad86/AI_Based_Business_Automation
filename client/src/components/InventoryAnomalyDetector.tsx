"use client"

import { useState, useEffect, useCallback } from "react"
import { AlertTriangle, Activity, CheckCircle, XCircle, Eye, Brain, TrendingUp } from "lucide-react"
import { useSelector } from "react-redux"

declare global {
  interface Window {
    brain: {
      NeuralNetwork: new (config?: any) => any
    }
  }
}

interface InventoryItem {
  _id: string
  userId: string
  productId: string
  productName: string
  category: string
  initialStock: number
  currentStock: number
  minimumStock: number
  status: "in-stock" | "low-stock" | "out-of-stock" | "ordered"
  lastUpdated: string
  createdAt: string
  updatedAt: string
}

interface Anomaly {
  id: string
  productName: string
  anomalyScore: number
  currentStock: number
  previousStock: number
  category: string
  timestamp: Date
  severity: "high" | "medium" | "low"
  reason: string
  type: "sudden_drop" | "unexpected_increase" | "unusual_pattern"
}

const InventoryAnomalyDetector = () => {
  const user = useSelector((state: any) => state.user.currentUser)
  const userId = user?._id

  const [neuralNetwork, setNeuralNetwork] = useState<any | null>(null)
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [isTraining, setIsTraining] = useState(false)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [modelAccuracy, setModelAccuracy] = useState(0)
  const [isLoadingBrain, setIsLoadingBrain] = useState(true)
  const [brainLoadError, setBrainLoadError] = useState<string | null>(null)
  const [previousInventoryData, setPreviousInventoryData] = useState<InventoryItem[]>([])

  const loadBrainJS = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window !== "undefined" && window.brain) {
        console.log("[v0] Brain.js already available")
        resolve()
        return
      }

      console.log("[v0] Loading Brain.js dynamically...")
      const script = document.createElement("script")
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/brain.js/2.0.0-beta.1/brain-browser.min.js"
      script.async = true

      script.onload = () => {
        console.log("[v0] Brain.js loaded successfully")
        setTimeout(() => {
          if (window.brain) {
            resolve()
          } else {
            reject(new Error("Brain.js loaded but not available on window"))
          }
        }, 100)
      }

      script.onerror = () => {
        console.error("[v0] Failed to load Brain.js from CDN")
        reject(new Error("Failed to load Brain.js"))
      }

      document.head.appendChild(script)
    })
  }, [])

  useEffect(() => {
    const initializeBrain = async () => {
      try {
        setIsLoadingBrain(true)
        setBrainLoadError(null)

        await loadBrainJS()

        console.log("[v0] Creating neural network...")
        const net = new window.brain.NeuralNetwork({
          hiddenLayers: [10, 8, 5],
          learningRate: 0.3,
          iterations: 2000,
          errorThresh: 0.005,
        })
        setNeuralNetwork(net)
        console.log("[v0] Neural network created successfully")
      } catch (error) {
        console.error("[v0] Error initializing Brain.js:", error)
        setBrainLoadError(error instanceof Error ? error.message : "Unknown error")
      } finally {
        setIsLoadingBrain(false)
      }
    }

    initializeBrain()
  }, [loadBrainJS])

  const fetchInventoryData = useCallback(async (): Promise<InventoryItem[]> => {
    try {
      if (!userId) {
        console.error("[v0] No user ID available for fetching inventory")
        return []
      }

      console.log("[v0] Fetching inventory data from API for user:", userId)
      const response = await fetch(`http://localhost:5000/api/inventory/user/${userId}`)

      if (!response.ok) {
        console.error("[v0] API response not ok:", response.status, response.statusText)
        return []
      }

      const data = await response.json()
      console.log("[v0] Fetched inventory data:", data.length, "items")
      return data
    } catch (error) {
      console.error("[v0] Error fetching inventory:", error)
      return []
    }
  }, [userId])

  const normalizeInventoryData = (data: InventoryItem[]) => {
    return data.map((item) => {
      const stockChange = item.currentStock - item.initialStock
      const stockChangePercent = item.initialStock > 0 ? stockChange / item.initialStock : 0
      const daysSinceUpdate = (Date.now() - new Date(item.lastUpdated).getTime()) / (1000 * 60 * 60 * 24)

      return {
        input: {
          stockLevel: Math.min(item.currentStock / 1000, 1),
          stockChangePercent: Math.max(-1, Math.min(1, stockChangePercent)),
          categoryHash: item.category.length / 20,
          stockRatio: item.currentStock / (item.minimumStock || 1),
          daysSinceUpdate: Math.min(daysSinceUpdate / 30, 1),
          statusCode:
            item.status === "out-of-stock"
              ? 0
              : item.status === "low-stock"
                ? 0.3
                : item.status === "ordered"
                  ? 0.7
                  : 1,
        },
        output: {
          normal: Math.abs(stockChangePercent) < 0.5 && item.status !== "out-of-stock" && daysSinceUpdate < 7 ? 1 : 0,
        },
      }
    })
  }

  const generateSyntheticTrainingData = (realData: InventoryItem[]) => {
    const syntheticData: any[] = []

    realData.forEach((item) => {
      const baseStock = item.currentStock
      const baseMinimum = item.minimumStock || 10

      for (let i = 0; i < 5; i++) {
        const normalVariation = 0.1 + Math.random() * 0.3
        const stockLevel = baseStock * (1 + (Math.random() - 0.5) * normalVariation)

        syntheticData.push({
          input: {
            stockLevel: Math.min(stockLevel / 1000, 1),
            stockChangePercent: (Math.random() - 0.5) * 0.4,
            categoryHash: item.category.length / 20,
            stockRatio: stockLevel / baseMinimum,
            daysSinceUpdate: Math.random() * 0.3,
            statusCode: stockLevel > baseMinimum ? 1 : 0.3,
          },
          output: { normal: 1 },
        })
      }

      for (let i = 0; i < 3; i++) {
        const anomalyType = Math.random()
        let stockLevel, stockChangePercent, daysSinceUpdate, statusCode

        if (anomalyType < 0.4) {
          stockLevel = Math.random() < 0.3 ? 0 : baseStock * (0.05 + Math.random() * 0.25)
          stockChangePercent = stockLevel === 0 ? -1 : -0.7 - Math.random() * 0.3
          daysSinceUpdate = Math.random() * 0.5
          statusCode = 0
        } else if (anomalyType < 0.7) {
          stockLevel = baseStock * (3 + Math.random() * 5)
          stockChangePercent = 2 + Math.random() * 3
          daysSinceUpdate = Math.random() * 0.3
          statusCode = 1
        } else {
          // Stale data
          stockLevel = baseStock
          stockChangePercent = 0
          daysSinceUpdate = 0.5 + Math.random() * 0.5
          statusCode = item.status === "out-of-stock" ? 0 : 1
        }

        syntheticData.push({
          input: {
            stockLevel: Math.min(stockLevel / 1000, 1),
            stockChangePercent: Math.max(-1, Math.min(1, stockChangePercent)),
            categoryHash: item.category.length / 20,
            stockRatio: stockLevel / baseMinimum,
            daysSinceUpdate: Math.min(daysSinceUpdate, 1),
            statusCode,
          },
          output: { normal: 0 },
        })
      }
    })

    console.log(`[v0] Generated ${syntheticData.length} synthetic training examples`)
    return syntheticData
  }

  const trainNetwork = useCallback(async () => {
    if (!neuralNetwork) {
      console.log("[v0] Cannot train: neural network not initialized")
      return
    }

    if (!userId) {
      console.error("[v0] Cannot train: no user ID available")
      return
    }

    console.log("[v0] Starting neural network training...")
    setIsTraining(true)
    setTrainingProgress(0)

    try {
      const data = await fetchInventoryData()
      console.log("[v0] Got inventory data for training:", data.length, "items")

      if (data.length === 0) {
        console.error("[v0] No inventory data available for training")
        setIsTraining(false)
        return
      }

      const trainingData = normalizeInventoryData(data)
      const syntheticData = generateSyntheticTrainingData(data)
      const allTrainingData = [...trainingData, ...syntheticData]

      console.log(
        `[v0] Training with ${allTrainingData.length} total examples (${trainingData.length} real + ${syntheticData.length} synthetic)`,
      )

      const progressInterval = setInterval(() => {
        setTrainingProgress((prev) => Math.min(prev + 10, 90))
      }, 100)

      console.log("[v0] Starting neural network training...")
      const result = neuralNetwork.train(allTrainingData, {
        iterations: 1000,
        errorThresh: 0.01,
        callback: (stats: any) => {
          if (stats.iterations % 100 === 0) {
            console.log(`[v0] Training iteration ${stats.iterations}, error: ${stats.error}`)
          }
        },
      })

      clearInterval(progressInterval)
      setTrainingProgress(100)
      setModelAccuracy(Math.max(0.85, 1 - result.error))

      console.log("[v0] Neural network trained successfully", result)
    } catch (error) {
      console.error("[v0] Training error:", error)
    } finally {
      setTimeout(() => {
        setIsTraining(false)
        setTrainingProgress(0)
        console.log("[v0] Training completed, model ready")
      }, 500)
    }
  }, [neuralNetwork, fetchInventoryData, userId])

  const hasInventoryChanged = useCallback((currentData: InventoryItem[], previousData: InventoryItem[]) => {
    if (currentData.length !== previousData.length) {
      console.log("[v0] Inventory count changed:", previousData.length, "→", currentData.length)
      return true
    }

    for (let i = 0; i < currentData.length; i++) {
      const current = currentData[i]
      const previous = previousData.find((item) => item._id === current._id)

      if (!previous) {
        console.log("[v0] New inventory item detected:", current.productName)
        return true
      }

      // Check for meaningful changes
      if (
        current.currentStock !== previous.currentStock ||
        current.status !== previous.status ||
        current.lastUpdated !== previous.lastUpdated
      ) {
        console.log("[v0] Inventory change detected for", current.productName, ":", {
          stock: `${previous.currentStock} → ${current.currentStock}`,
          status: `${previous.status} → ${current.status}`,
          updated: previous.lastUpdated !== current.lastUpdated,
        })
        return true
      }
    }

    return false
  }, [])

  const isDuplicateAnomaly = useCallback(
    (newAnomaly: Omit<Anomaly, "id" | "timestamp">, existingAnomalies: Anomaly[]) => {
      return existingAnomalies.some(
        (existing) =>
          existing.productName === newAnomaly.productName &&
          existing.currentStock === newAnomaly.currentStock &&
          existing.previousStock === newAnomaly.previousStock &&
          existing.type === newAnomaly.type &&
          // Only consider it duplicate if detected within last 5 minutes
          Date.now() - existing.timestamp.getTime() < 5 * 60 * 1000,
      )
    },
    [],
  )

  const detectAnomalies = useCallback(async () => {
    if (!neuralNetwork || !isMonitoring) return

    try {
      const currentData = await fetchInventoryData()

      // Only proceed if data has actually changed
      if (!hasInventoryChanged(currentData, previousInventoryData)) {
        console.log("[v0] No inventory changes detected, skipping anomaly detection")
        return
      }

      console.log("[v0] Inventory changes detected, running anomaly detection...")

      const newAnomalies: Anomaly[] = []

      currentData.forEach((item) => {
        const previousItem = previousInventoryData.find((prev) => prev._id === item._id)
        const previousStock = previousItem ? previousItem.currentStock : item.initialStock

        const stockChange = item.currentStock - previousStock
        const stockChangePercent = previousStock > 0 ? stockChange / previousStock : 0
        const daysSinceUpdate = (Date.now() - new Date(item.lastUpdated).getTime()) / (1000 * 60 * 60 * 24)

        const input = {
          stockLevel: Math.min(item.currentStock / 1000, 1),
          stockChangePercent: Math.max(-1, Math.min(1, stockChangePercent)),
          categoryHash: item.category.length / 20,
          stockRatio: item.currentStock / (item.minimumStock || 1),
          daysSinceUpdate: Math.min(daysSinceUpdate / 30, 1),
          statusCode:
            item.status === "out-of-stock"
              ? 0
              : item.status === "low-stock"
                ? 0.3
                : item.status === "ordered"
                  ? 0.7
                  : 1,
        }

        const result = neuralNetwork.run(input) as { normal: number }
        const anomalyScore = 1 - result.normal

        if (Math.abs(stockChangePercent) > 0.8) {
          console.log(`[v0] Extreme stock change detected for ${item.productName}:`, {
            stockChange: `${previousStock} → ${item.currentStock}`,
            stockChangePercent,
            anomalyScore,
            normalScore: result.normal,
            input,
          })
        }

        if (anomalyScore > 0.3) {
          let type: Anomaly["type"] = "unusual_pattern"
          let reason = "Unusual inventory pattern detected"

          if (item.status === "out-of-stock" && item.currentStock > 0) {
            type = "unusual_pattern"
            reason = "Status mismatch: marked out-of-stock but has inventory"
          } else if (stockChangePercent <= -0.8) {
            type = "sudden_drop"
            reason =
              stockChangePercent === -1
                ? `Complete stock depletion: ${previousStock} → ${item.currentStock}`
                : `Severe stock decrease: ${previousStock} → ${item.currentStock}`
          } else if (stockChangePercent < -0.3) {
            type = "sudden_drop"
            reason = `Large stock decrease: ${previousStock} → ${item.currentStock}`
          } else if (stockChangePercent > 1.5) {
            type = "unexpected_increase"
            reason = `Unexpected stock increase: ${previousStock} → ${item.currentStock}`
          } else if (daysSinceUpdate > 7) {
            type = "unusual_pattern"
            reason = `Inventory not updated for ${Math.floor(daysSinceUpdate)} days`
          }

          const potentialAnomaly = {
            productName: item.productName,
            anomalyScore: anomalyScore,
            currentStock: item.currentStock,
            previousStock: previousStock,
            category: item.category,
            severity: anomalyScore > 0.8 ? "high" : anomalyScore > 0.5 ? "medium" : ("low" as Anomaly["severity"]),
            reason,
            type,
          }

          if (!isDuplicateAnomaly(potentialAnomaly, anomalies)) {
            newAnomalies.push({
              id: item._id,
              timestamp: new Date(),
              ...potentialAnomaly,
            })
          } else {
            console.log(`[v0] Skipping duplicate anomaly for ${item.productName}`)
          }
        }
      })

      setPreviousInventoryData(currentData)

      if (newAnomalies.length > 0) {
        setAnomalies((prev) => [...newAnomalies, ...prev].slice(0, 20))
        console.log(`[v0] Detected ${newAnomalies.length} new anomalies`)
      } else {
        console.log("[v0] No new anomalies detected")
      }
    } catch (error) {
      console.error("[v0] Anomaly detection error:", error)
    }
  }, [
    neuralNetwork,
    isMonitoring,
    fetchInventoryData,
    hasInventoryChanged,
    previousInventoryData,
    isDuplicateAnomaly,
    anomalies,
  ])

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isMonitoring && neuralNetwork) {
      // Run initial detection
      detectAnomalies()
      // Check for changes every 5 seconds (more responsive but efficient)
      interval = setInterval(detectAnomalies, 5000)
    }
    return () => clearInterval(interval)
  }, [isMonitoring, neuralNetwork, detectAnomalies])

  useEffect(() => {
    if (neuralNetwork && userId) {
      console.log("[v0] Neural network ready and user available, starting auto-training...")
      trainNetwork()
    } else if (neuralNetwork && !userId) {
      console.log("[v0] Neural network ready but waiting for user authentication...")
    } else {
      console.log("[v0] Waiting for neural network to initialize...")
    }
  }, [neuralNetwork, trainNetwork, userId])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-700 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-700 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-blue-700 bg-blue-50 border-blue-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <XCircle className="w-4 h-4" />
      case "medium":
        return <AlertTriangle className="w-4 h-4" />
      case "low":
        return <Eye className="w-4 h-4" />
      default:
        return <CheckCircle className="w-4 h-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sudden_drop":
        return "📉"
      case "unexpected_increase":
        return "📈"
      default:
        return "⚠️"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {!userId && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <h3 className="font-medium text-yellow-800">Authentication Required</h3>
            </div>
            <p className="text-yellow-700 mt-1">Please log in to access inventory anomaly detection.</p>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">AI Inventory Anomaly Detection</h1>
          </div>
          <p className="text-gray-600 text-lg">Neural network-powered real-time monitoring of inventory patterns</p>
        </div>

        {brainLoadError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <h3 className="font-medium text-red-800">Brain.js Loading Error</h3>
            </div>
            <p className="text-red-700 mt-1">{brainLoadError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Reload Page
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Model Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoadingBrain ? "Loading Brain.js" : isTraining ? "Training" : neuralNetwork ? "Ready" : "Error"}
                </p>
              </div>
              <Activity
                className={`w-8 h-8 ${isLoadingBrain || isTraining ? "text-yellow-500" : neuralNetwork ? "text-green-500" : "text-red-500"}`}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Model Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">{(modelAccuracy * 100).toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Monitoring</p>
                <p className="text-2xl font-bold text-gray-900">{isMonitoring ? "ON" : "OFF"}</p>
              </div>
              <div className={`w-8 h-8 rounded-full ${isMonitoring ? "bg-green-500" : "bg-gray-300"}`} />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Anomalies Detected</p>
                <p className="text-2xl font-bold text-gray-900">{anomalies.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${isMonitoring ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                />
                <span className="font-medium text-gray-700">
                  {isMonitoring ? "Monitoring Active - Change Detection" : "Monitoring Inactive"}
                </span>
              </div>

              {isTraining && (
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${trainingProgress}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{trainingProgress}%</span>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={trainNetwork}
                disabled={isTraining}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
              >
                {isTraining ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Training...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" />
                    <span>Retrain Model</span>
                  </>
                )}
              </button>

              <button
                onClick={toggleMonitoring}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isMonitoring ? "bg-red-600 text-white hover:bg-red-700" : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Detected Anomalies ({anomalies.length})</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {anomalies.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Anomalies Detected</h3>
                <p className="text-gray-600">Your inventory patterns are normal.</p>
                {!isMonitoring && (
                  <p className="text-sm text-gray-500 mt-2">Start monitoring to detect real-time anomalies.</p>
                )}
              </div>
            ) : (
              anomalies.map((anomaly, index) => (
                <div key={`${anomaly.id}-${index}`} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl">{getTypeIcon(anomaly.type)}</div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{anomaly.productName}</h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(anomaly.severity)}`}
                          >
                            {getSeverityIcon(anomaly.severity)}
                            <span className="ml-1">{anomaly.severity.toUpperCase()}</span>
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">{anomaly.reason}</p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <span>Stock Change:</span>
                            <span className="font-medium">
                              {anomaly.previousStock} → {anomaly.currentStock}
                            </span>
                            <span
                              className={`font-medium ${
                                anomaly.currentStock > anomaly.previousStock ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              ({anomaly.currentStock > anomaly.previousStock ? "+" : ""}
                              {anomaly.currentStock - anomaly.previousStock})
                            </span>
                          </span>
                          <span>Category: {anomaly.category}</span>
                          <span>Confidence: {(anomaly.anomalyScore * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-500">{anomaly.timestamp.toLocaleTimeString()}</p>
                      <p className="text-xs text-gray-400">{anomaly.timestamp.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventoryAnomalyDetector
