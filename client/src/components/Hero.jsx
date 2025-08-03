"use client"

import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { X, Loader2 } from "lucide-react"

const floatAnimation = {
  animation: "float 4s ease-in-out infinite",
}

function ArcadeEmbed({ onLoad, onError }) {
  const arcadeIframeRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    function onArcadeIframeMessage(e) {
      if (e.origin !== "https://demo.arcade.software" || !e.isTrusted) return
      const arcadeIframe = arcadeIframeRef.current
      if (!arcadeIframe || !arcadeIframe.contentWindow) return

      if (e.data.event === "arcade-init") {
        arcadeIframe.contentWindow.postMessage({ event: "register-popout-handler" }, "*")
        setIsLoaded(true)
        onLoad && onLoad()
      }

      if (e.data.event === "arcade-popout-open") {
        arcadeIframe.style["position"] = "fixed"
        arcadeIframe.style["z-index"] = "9999999"
      }
      if (e.data.event === "arcade-popout-close") {
        arcadeIframe.style["position"] = "absolute"
        arcadeIframe.style["z-index"] = "auto"
      }
    }

    window.addEventListener("message", onArcadeIframeMessage)
    const arcadeIframe = arcadeIframeRef.current

    // Preload and cache the iframe
    if (arcadeIframe) {
      arcadeIframe.onload = () => {
        setIsLoaded(true)
        onLoad && onLoad()
      }
      arcadeIframe.onerror = () => {
        setHasError(true)
        onError && onError()
      }

      if (arcadeIframe.contentWindow) {
        arcadeIframe.contentWindow.postMessage({ event: "register-popout-handler" }, "*")
      }
    }

    return () => {
      if (arcadeIframe && arcadeIframe.contentWindow) {
        arcadeIframe.contentWindow.postMessage({ event: "unregister-popout-handler" }, "*")
      }
      window.removeEventListener("message", onArcadeIframeMessage)
    }
  }, [onLoad, onError])

  return (
    <div style={{ position: "relative", paddingBottom: "calc(43.697916666666664% + 41px)", height: 0, width: "100%" }}>
      {/* Loading Overlay */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading demo...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Failed to load demo</p>
            <button
              onClick={() => {
                setHasError(false)
                setIsLoaded(false)
                window.location.reload()
              }}
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <iframe
        ref={arcadeIframeRef}
        src="https://demo.arcade.software/kMzrKGSmDnYgWjlqOgfM?embed&embed_mobile=modal&embed_desktop=modal&show_copy_link=true&speed=1.5"
        title="React App"
        frameBorder="0"
        loading="eager"
        allowFullScreen
        allow="clipboard-write"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          colorScheme: "light",
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      />
    </div>
  )
}

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const [demoLoaded, setDemoLoaded] = useState(false)
  const [preloadDemo, setPreloadDemo] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Preload the demo after component mounts for faster loading
    const preloadTimer = setTimeout(() => {
      setPreloadDemo(true)
    }, 2000)

    return () => clearTimeout(preloadTimer)
  }, [])

  useEffect(() => {
    if (showDemo) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [showDemo])

  const handleDemoClick = (e) => {
    e.preventDefault()
    setShowDemo(true)
  }

  const handleCloseDemo = () => {
    setShowDemo(false)
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseDemo()
    }
  }

  const handleDemoLoad = () => {
    setDemoLoaded(true)
  }

  const handleDemoError = () => {
    console.warn("Demo failed to load")
  }

  if (!isMounted) return null

  return (
    <>
      <section className="bg-gradient-to-br from-primary-50 to-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                Automate Smarter. <span className="text-primary-600">Grow Faster.</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Harness the power of AI to streamline your business workflows, predict sales trends, and gain actionable
                insights—all without writing a single line of code.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {/* <Link
                  to="#"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg text-base font-medium transition duration-150 ease-in-out shadow-md text-center"
                >
                  Start Free Trial
                </Link> */}
                <button
                  onClick={handleDemoClick}
                  className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg text-base font-medium transition duration-150 ease-in-out shadow-sm text-center border border-gray-200"
                >
                  See Demo {demoLoaded && <span className="text-green-600">●</span>}
                </button>
              </div>
              <div className="mt-8 flex items-center">
                <div className="flex -space-x-2">
                  {["1", "2", "3"].map((item) => (
                    <img
                      key={item}
                      src={`https://randomuser.me/api/portraits/men/${item}.jpg`}
                      width={40}
                      height={40}
                      className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                      alt="User"
                    />
                  ))}
                </div>
                <p className="ml-4 text-sm text-gray-600">
                  Trusted by <span className="font-semibold">500+</span> businesses worldwide
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="dashboard-mockup p-4" style={floatAnimation}>
                {/* Dashboard content */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Business Dashboard</h3>
                    <p className="text-sm text-gray-500">Last updated: Just now</p>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add the CSS for the animation */}
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
          `}
        </style>
      </section>

      {/* Hidden preload iframe for caching */}
      {preloadDemo && !showDemo && (
        <div style={{ position: "absolute", left: "-9999px", top: "-9999px", width: "1px", height: "1px" }}>
          <ArcadeEmbed
            onLoad={handleDemoLoad}
            onError={handleDemoError}
            src="https://demo.arcade.software/kMzrKGSmDnYgWjlqOgfM?embed&embed_mobile=modal&embed_desktop=modal&show_copy_link=true&speed=1.5"
          />
        </div>
      )}

      {/* Demo Modal - Centered and Compact */}
      {showDemo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden">

            <div className="flex-1 p-4 min-h-0">
              <div className="w-full h-full">
                <ArcadeEmbed onLoad={handleDemoLoad} onError={handleDemoError} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
