import React, { useState, useEffect, useRef } from 'react';
import Quagga from 'quagga';
import JsBarcode from 'jsbarcode';

const BarcodeScanner = () => {
    const [imageSrc, setImageSrc] = useState('');
    const [barcode, setBarcode] = useState('');
    const [barcodeType, setBarcodeType] = useState('');
    const [barcodeFormat, setBarcodeFormat] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [productDetails, setProductDetails] = useState(null);
    const barcodeCanvasRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.match('image.*')) {
            setError('Please select an image file (JPG, PNG, GIF)');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('File size exceeds 5MB limit');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setImageSrc(event.target.result);
            setBarcode('');
            setBarcodeType('');
            setError('');
            scanBarcode(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    const formatCleaner = (format) => {
        // Remove "Type: " prefix and underscores, convert to lowercase
        return format.replace(/^Type: /i, '')
                     .toLowerCase()
                     .replace(/_/g, '')
                     .replace(/ reader$/, '');
    };

    const scanBarcode = (imageData) => {
        setLoading(true);
        Quagga.decodeSingle({
            decoder: {
                readers: [
                    'code_128_reader', 'ean_reader', 'ean_8_reader',
                    'code_39_reader', 'code_39_vin_reader', 'codabar_reader',
                    'upc_reader', 'upc_e_reader'
                ]
            },
            locate: true,
            src: imageData
        }, async (result) => {
            setLoading(false);
            if (result && result.codeResult) {
                const code = result.codeResult.code;
                const rawFormat = result.codeResult.format;
                const cleanFormat = formatCleaner(rawFormat);

                setBarcode(code);
                setBarcodeType(`Type: ${rawFormat}`);
                setBarcodeFormat(cleanFormat);
                console.log('Scanned Barcode:', code);
                console.log('Barcode Format:', cleanFormat);
                await fetchProductDetails(code);

                try {
                    JsBarcode(barcodeCanvasRef.current, code, {
                        format: cleanFormat,
                        lineColor: '#374151',
                        width: 2,
                        height: 60,
                        displayValue: true
                    });
                } catch (e) {
                    console.error('Could not generate barcode preview:', e);
                }
            } else {
                setError('No barcode detected. Please try another image.');
            }
        });
    };

    const fetchProductDetails = async (barcodeValue) => {
        try {
            const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcodeValue}.json`);
            const data = await response.json();

            if (data.status === 1 && data.product) {
                const product = data.product;
                setProductDetails({
                    name: product.product_name || 'Unknown Product',
                    brand: product.brands || 'Unknown Brand',
                    ingredients: product.ingredients_text || 'Ingredients not available',
                    imageUrl: product.image_url || 'No image available',
                });
            } else {
                setError('Product not found');
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
            setError('Error fetching product details');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(barcode);
    };

    const downloadTextFile = () => {
        const blob = new Blob([barcode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'barcode_data.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        if (barcode && barcodeCanvasRef.current && barcodeFormat) {
            try {
                JsBarcode(barcodeCanvasRef.current, barcode, {
                    format: barcodeFormat,
                    lineColor: '#374151',
                    width: 2,
                    height: 60,
                    displayValue: true
                });
            } catch (e) {
                console.error('Could not generate barcode preview:', e);
            }
        }
    }, [barcode, barcodeFormat]);

    return (
        <div className="bg-gray-50 min-h-screen px-4 py-12 max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Barcode Scanner Pro</h1>
                <p className="text-gray-600">Upload an image containing a barcode and we'll extract the information for you</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="dropzone rounded-lg p-12 text-center cursor-pointer">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <i className="fas fa-barcode text-blue-500 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Drag & drop your barcode image here</h3>
                    <p className="text-gray-500 mb-4">or</p>
                    <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                        <i className="fas fa-upload mr-2"></i> Select Image
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                    <p className="text-gray-400 text-sm mt-3">Supports: JPG, PNG, GIF (Max 5MB)</p>
                </div>

                {imageSrc && (
                    <div className="mt-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-700 mb-3">Your Image</h3>
                                <div className="border rounded-lg overflow-hidden">
                                    <img src={imageSrc} alt="Preview" className="max-h-[300px] object-contain w-full" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-700 mb-3">Scan Results</h3>

                                {loading && (
                                    <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                                        <div className="animate-spin text-blue-500 text-4xl">
                                            <i className="fas fa-circle-notch"></i>
                                        </div>
                                        <span className="ml-3 text-gray-600">Scanning barcode...</span>
                                    </div>
                                )}

                                {!loading && barcode && (
                                    <div className="bg-gray-50 rounded-lg p-6 transition-all duration-300">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-medium text-gray-700">Barcode Information</h4>
                                            <div className="flex space-x-2">
                                                <button onClick={copyToClipboard} className="p-2 text-gray-500 hover:text-blue-500">
                                                    <i className="far fa-copy"></i>
                                                </button>
                                                <button onClick={downloadTextFile} className="p-2 text-gray-500 hover:text-blue-500">
                                                    <i className="fas fa-download"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="bg-white p-4 rounded border border-gray-200 font-mono text-gray-800 break-words">{barcode}</div>
                                        <div className="mt-3 text-sm text-gray-500">{barcodeType}</div>
                                        <div className="mt-4 flex justify-center">
                                            <canvas ref={barcodeCanvasRef}></canvas>
                                        </div>
                                    </div>
                                )}

                                {productDetails && (
                                    <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                                        <h3 className="text-xl font-semibold text-gray-700">{productDetails.name}</h3>
                                        <p className="text-gray-600">Brand: {productDetails.brand}</p>
                                        <p className="text-gray-600 mt-2">Ingredients: {productDetails.ingredients}</p>
                                        <div className="mt-4">
                                            {productDetails.imageUrl ? (
                                                <img src={productDetails.imageUrl} alt="Product" className="max-w-xs" />
                                            ) : (
                                                <p>No image available</p>
                                            )}
                                        </div>
                                    </div>
                                )}


                                {error && (
                                    <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-gray-50 p-8 border-t mt-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">How to get the best results</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    {[
                        { icon: 'fa-camera', title: 'Good Lighting', text: 'Ensure the barcode is well-lit without glare' },
                        { icon: 'fa-ruler-combined', title: 'Straight Angle', text: 'Hold your camera parallel to the barcode' },
                        { icon: 'fa-expand', title: 'Clear Focus', text: 'Make sure the barcode fills most of the image' }
                    ].map((tip, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                <i className={`fas ${tip.icon} text-blue-500`}></i>
                            </div>
                            <h4 className="font-medium text-gray-700 mb-1">{tip.title}</h4>
                            <p className="text-gray-500 text-sm">{tip.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 text-center text-gray-400 text-sm">
                <p>Barcode Scanner Pro uses advanced algorithms to read various barcode formats including UPC, EAN, Code 128, and more.</p>
            </div>
        </div>
    );
};

export default BarcodeScanner;



// import React, { useState, useEffect, useRef } from 'react';
// import { Camera, Upload, Copy, Download, Check, X, AlertTriangle, Zap } from 'lucide-react';

// const ProfessionalBarcodeScanner = () => {
//     const [imageSrc, setImageSrc] = useState('');
//     const [barcode, setBarcode] = useState('');
//     const [barcodeType, setBarcodeType] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [productDetails, setProductDetails] = useState(null);
//     const [validationStatus, setValidationStatus] = useState('');
//     const [processingSteps, setProcessingSteps] = useState([]);
//     const [confidence, setConfidence] = useState(0);
//     const canvasRef = useRef(null);
//     const imageRef = useRef(null);

//     // Enhanced image preprocessing
//     const preprocessImage = (canvas, ctx, img) => {
//         const steps = [];
        
//         // Step 1: Draw original image
//         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//         steps.push("Original image loaded");

//         // Step 2: Convert to grayscale for better contrast
//         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//         const data = imageData.data;
        
//         for (let i = 0; i < data.length; i += 4) {
//             const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
//             data[i] = gray;
//             data[i + 1] = gray;
//             data[i + 2] = gray;
//         }
        
//         ctx.putImageData(imageData, 0, 0);
//         steps.push("Converted to grayscale");

//         // Step 3: Enhance contrast
//         const contrastImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//         const contrastData = contrastImageData.data;
//         const factor = 259 * (128 + 255) / (255 * (259 - 128));
        
//         for (let i = 0; i < contrastData.length; i += 4) {
//             contrastData[i] = Math.min(255, Math.max(0, factor * (contrastData[i] - 128) + 128));
//             contrastData[i + 1] = contrastData[i];
//             contrastData[i + 2] = contrastData[i];
//         }
        
//         ctx.putImageData(contrastImageData, 0, 0);
//         steps.push("Enhanced contrast");

//         setProcessingSteps(steps);
//         return canvas.toDataURL();
//     };

//     // Barcode validation using check digits
//     const validateBarcode = (code, format) => {
//         let isValid = false;
//         let validationType = '';

//         try {
//             switch (format.toLowerCase()) {
//                 case 'ean_13':
//                 case 'ean13':
//                     isValid = validateEAN13(code);
//                     validationType = 'EAN-13';
//                     break;
//                 case 'ean_8':
//                 case 'ean8':
//                     isValid = validateEAN8(code);
//                     validationType = 'EAN-8';
//                     break;
//                 case 'upc_a':
//                 case 'upca':
//                     isValid = validateUPCA(code);
//                     validationType = 'UPC-A';
//                     break;
//                 case 'upc_e':
//                 case 'upce':
//                     isValid = validateUPCE(code);
//                     validationType = 'UPC-E';
//                     break;
//                 case 'code_128':
//                 case 'code128':
//                     isValid = validateCode128(code);
//                     validationType = 'Code 128';
//                     break;
//                 default:
//                     isValid = code.length > 0;
//                     validationType = format.toUpperCase();
//             }
//         } catch (e) {
//             console.error('Validation error:', e);
//             isValid = false;
//         }

//         return { isValid, validationType };
//     };

//     const validateEAN13 = (code) => {
//         if (code.length !== 13) return false;
        
//         let sum = 0;
//         for (let i = 0; i < 12; i++) {
//             sum += parseInt(code[i]) * (i % 2 === 0 ? 1 : 3);
//         }
//         const checkDigit = (10 - (sum % 10)) % 10;
//         return checkDigit === parseInt(code[12]);
//     };

//     const validateEAN8 = (code) => {
//         if (code.length !== 8) return false;
        
//         let sum = 0;
//         for (let i = 0; i < 7; i++) {
//             sum += parseInt(code[i]) * (i % 2 === 0 ? 1 : 3);
//         }
//         const checkDigit = (10 - (sum % 10)) % 10;
//         return checkDigit === parseInt(code[7]);
//     };

//     const validateUPCA = (code) => {
//         if (code.length !== 12) return false;
        
//         let sum = 0;
//         for (let i = 0; i < 11; i++) {
//             sum += parseInt(code[i]) * (i % 2 === 0 ? 3 : 1);
//         }
//         const checkDigit = (10 - (sum % 10)) % 10;
//         return checkDigit === parseInt(code[11]);
//     };

//     const validateUPCE = (code) => {
//         return code.length === 8 || code.length === 6;
//     };

//     const validateCode128 = (code) => {
//         return code.length >= 1 && /^[\x00-\x7F]*$/.test(code);
//     };

//     // Multiple detection attempts with different configurations
//     const attemptBarcodeDetection = async (imageData) => {
//         const detectionConfigs = [
//             {
//                 name: 'Standard Detection',
//                 config: {
//                     readers: ['code_128_reader', 'ean_reader', 'ean_8_reader', 'code_39_reader', 'upc_reader', 'upc_e_reader'],
//                     locate: true,
//                     multiple: false
//                 }
//             },
//             {
//                 name: 'High Precision',
//                 config: {
//                     readers: ['ean_reader', 'upc_reader'],
//                     locate: true,
//                     multiple: false,
//                     debug: false
//                 }
//             },
//             {
//                 name: 'Code 128 Focus',
//                 config: {
//                     readers: ['code_128_reader'],
//                     locate: true,
//                     multiple: false
//                 }
//             }
//         ];

//         for (const attempt of detectionConfigs) {
//             try {
//                 setProcessingSteps(prev => [...prev, `Trying ${attempt.name}...`]);
                
//                 const result = await new Promise((resolve, reject) => {
//                     // Simulated detection since we can't use Quagga in this environment
//                     setTimeout(() => {
//                         // Mock successful detection for demonstration
//                         if (Math.random() > 0.3) {
//                             resolve({
//                                 codeResult: {
//                                     code: '1234567890123',
//                                     format: 'ean_13'
//                                 }
//                             });
//                         } else {
//                             resolve(null);
//                         }
//                     }, 1000);
//                 });

//                 if (result && result.codeResult) {
//                     const validation = validateBarcode(result.codeResult.code, result.codeResult.format);
//                     setProcessingSteps(prev => [...prev, `${attempt.name} successful!`]);
//                     return {
//                         ...result,
//                         validation,
//                         confidence: 85 + Math.random() * 15
//                     };
//                 }
//             } catch (error) {
//                 console.error(`${attempt.name} failed:`, error);
//                 setProcessingSteps(prev => [...prev, `${attempt.name} failed`]);
//             }
//         }

//         return null;
//     };

//     const handleFileChange = async (e) => {
//         const file = e.target.files[0];
//         if (!file || !file.type.match('image.*')) {
//             setError('Please select a valid image file (JPG, PNG, GIF, WebP)');
//             return;
//         }
        
//         if (file.size > 10 * 1024 * 1024) {
//             setError('File size exceeds 10MB limit');
//             return;
//         }

//         const reader = new FileReader();
//         reader.onload = async (event) => {
//             setImageSrc(event.target.result);
//             resetState();
//             await scanBarcode(event.target.result);
//         };
//         reader.readAsDataURL(file);
//     };

//     const resetState = () => {
//         setBarcode('');
//         setBarcodeType('');
//         setError('');
//         setProductDetails(null);
//         setValidationStatus('');
//         setProcessingSteps([]);
//         setConfidence(0);
//     };

//     const scanBarcode = async (imageData) => {
//         setLoading(true);
//         setProcessingSteps(['Starting barcode detection...']);

//         try {
//             // Create image element for preprocessing
//             const img = new Image();
//             img.onload = async () => {
//                 // Create canvas for image preprocessing
//                 const canvas = document.createElement('canvas');
//                 const ctx = canvas.getContext('2d');
//                 canvas.width = img.width;
//                 canvas.height = img.height;

//                 // Preprocess image
//                 const processedImageData = preprocessImage(canvas, ctx, img);
                
//                 // Attempt barcode detection
//                 const result = await attemptBarcodeDetection(processedImageData);
                
//                 if (result && result.codeResult) {
//                     const code = result.codeResult.code;
//                     const format = result.codeResult.format;
//                     const validation = result.validation;
//                     const confidence = result.confidence;

//                     setBarcode(code);
//                     setBarcodeType(format);
//                     setConfidence(confidence);
                    
//                     if (validation.isValid) {
//                         setValidationStatus(`✓ Valid ${validation.validationType} barcode`);
//                         await fetchProductDetails(code);
//                     } else {
//                         setValidationStatus(`⚠ Invalid ${validation.validationType} barcode (possibly fake or corrupted)`);
//                         setError('Barcode validation failed. This may be a fake or corrupted barcode.');
//                     }
                    
//                     setProcessingSteps(prev => [...prev, 'Barcode detection completed!']);
//                 } else {
//                     setError('No barcode detected. Please ensure the image contains a clear, well-lit barcode.');
//                     setProcessingSteps(prev => [...prev, 'Detection failed - no barcode found']);
//                 }
//             };
//             img.src = imageData;
//         } catch (error) {
//             console.error('Scanning error:', error);
//             setError('An error occurred during barcode scanning. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchProductDetails = async (barcodeValue) => {
//         setProcessingSteps(prev => [...prev, 'Fetching product information...']);
        
//         try {
//             // Try multiple product databases
//             const databases = [
//                 {
//                     name: 'OpenFoodFacts',
//                     url: `https://world.openfoodfacts.org/api/v0/product/${barcodeValue}.json`,
//                     parser: (data) => data.status === 1 && data.product ? {
//                         name: data.product.product_name || 'Unknown Product',
//                         brand: data.product.brands || 'Unknown Brand',
//                         category: data.product.categories || 'Unknown Category',
//                         ingredients: data.product.ingredients_text || 'Ingredients not available',
//                         imageUrl: data.product.image_url,
//                         source: 'OpenFoodFacts'
//                     } : null
//                 },
//                 {
//                     name: 'UPC Database',
//                     url: `https://api.upcitemdb.com/prod/trial/lookup?upc=${barcodeValue}`,
//                     parser: (data) => data.items && data.items.length > 0 ? {
//                         name: data.items[0].title || 'Unknown Product',
//                         brand: data.items[0].brand || 'Unknown Brand',
//                         category: data.items[0].category || 'Unknown Category',
//                         description: data.items[0].description || 'No description available',
//                         imageUrl: data.items[0].images?.[0],
//                         source: 'UPC Database'
//                     } : null
//                 }
//             ];

//             for (const db of databases) {
//                 try {
//                     setProcessingSteps(prev => [...prev, `Checking ${db.name}...`]);
                    
//                     // Mock API response for demonstration
//                     const mockProduct = {
//                         name: 'Sample Product',
//                         brand: 'Sample Brand',
//                         category: 'Food & Beverages',
//                         ingredients: 'Sample ingredients list',
//                         imageUrl: 'https://via.placeholder.com/200x200?text=Product',
//                         source: db.name
//                     };
                    
//                     setProductDetails(mockProduct);
//                     setProcessingSteps(prev => [...prev, `Product found in ${db.name}!`]);
//                     return;
//                 } catch (error) {
//                     console.error(`${db.name} lookup failed:`, error);
//                     setProcessingSteps(prev => [...prev, `${db.name} lookup failed`]);
//                 }
//             }

//             setError('Product not found in any database. This may be a private label or regional product.');
//             setProcessingSteps(prev => [...prev, 'Product lookup completed - no matches found']);
//         } catch (error) {
//             console.error('Error fetching product details:', error);
//             setError('Error fetching product details from all databases.');
//         }
//     };

//     const copyToClipboard = async () => {
//         try {
//             await navigator.clipboard.writeText(barcode);
//             // Show success feedback
//             const button = document.querySelector('[data-copy-btn]');
//             if (button) {
//                 button.textContent = 'Copied!';
//                 setTimeout(() => button.textContent = 'Copy', 2000);
//             }
//         } catch (error) {
//             console.error('Copy failed:', error);
//         }
//     };

//     const downloadResults = () => {
//         const results = {
//             barcode,
//             type: barcodeType,
//             validationStatus,
//             confidence: `${confidence.toFixed(1)}%`,
//             productDetails,
//             timestamp: new Date().toISOString()
//         };
        
//         const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `barcode_results_${barcode || 'unknown'}.json`;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         URL.revokeObjectURL(url);
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//             <div className="max-w-6xl mx-auto">
//                 {/* Header */}
//                 <div className="text-center mb-8">
//                     <div className="flex items-center justify-center mb-4">
//                         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full">
//                             <Camera className="w-8 h-8 text-white" />
//                         </div>
//                     </div>
//                     <h1 className="text-4xl font-bold text-gray-800 mb-2">Professional Barcode Scanner</h1>
//                     <p className="text-gray-600 max-w-2xl mx-auto">
//                         Advanced AI-powered barcode detection with validation, multiple format support, and comprehensive product lookup
//                     </p>
//                 </div>

//                 {/* Main Content */}
//                 <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//                     {/* Upload Section */}
//                     <div className="p-8 border-b border-gray-200">
//                         <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors">
//                             <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
//                                 <Upload className="w-8 h-8 text-blue-600" />
//                             </div>
//                             <h3 className="text-xl font-semibold text-gray-700 mb-2">Upload Barcode Image</h3>
//                             <p className="text-gray-500 mb-6">Support for all major formats: UPC, EAN, Code 128, Code 39, and more</p>
//                             <label className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 cursor-pointer transform hover:scale-105 transition-all">
//                                 <Upload className="w-5 h-5 mr-2" />
//                                 Select Image
//                                 <input 
//                                     type="file" 
//                                     accept="image/*,.webp" 
//                                     className="hidden" 
//                                     onChange={handleFileChange} 
//                                 />
//                             </label>
//                             <p className="text-gray-400 text-sm mt-4">Supports: JPG, PNG, GIF, WebP (Max 10MB)</p>
//                         </div>
//                     </div>

//                     {/* Results Section */}
//                     {imageSrc && (
//                         <div className="p-8">
//                             <div className="grid lg:grid-cols-2 gap-8">
//                                 {/* Image Preview */}
//                                 <div>
//                                     <h3 className="text-xl font-semibold text-gray-700 mb-4">Uploaded Image</h3>
//                                     <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
//                                         <img 
//                                             ref={imageRef}
//                                             src={imageSrc} 
//                                             alt="Barcode" 
//                                             className="w-full h-64 object-contain bg-gray-50" 
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Results Panel */}
//                                 <div>
//                                     <h3 className="text-xl font-semibold text-gray-700 mb-4">Detection Results</h3>
                                    
//                                     {loading && (
//                                         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
//                                             <div className="flex items-center mb-4">
//                                                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                                                 <span className="ml-3 text-gray-700 font-medium">Processing barcode...</span>
//                                             </div>
//                                             <div className="space-y-2">
//                                                 {processingSteps.map((step, index) => (
//                                                     <div key={index} className="flex items-center text-sm text-gray-600">
//                                                         <Zap className="w-4 h-4 mr-2 text-blue-500" />
//                                                         {step}
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}

//                                     {!loading && barcode && (
//                                         <div className="space-y-6">
//                                             {/* Barcode Information */}
//                                             <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
//                                                 <div className="flex items-center justify-between mb-4">
//                                                     <h4 className="font-semibold text-gray-700 flex items-center">
//                                                         <Check className="w-5 h-5 text-green-500 mr-2" />
//                                                         Barcode Detected
//                                                     </h4>
//                                                     <div className="flex space-x-2">
//                                                         <button 
//                                                             data-copy-btn
//                                                             onClick={copyToClipboard}
//                                                             className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                                                             title="Copy barcode"
//                                                         >
//                                                             <Copy className="w-4 h-4" />
//                                                         </button>
//                                                         <button 
//                                                             onClick={downloadResults}
//                                                             className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                                                             title="Download results"
//                                                         >
//                                                             <Download className="w-4 h-4" />
//                                                         </button>
//                                                     </div>
//                                                 </div>
                                                
//                                                 <div className="bg-white p-4 rounded-lg border font-mono text-lg text-gray-800 break-all mb-3">
//                                                     {barcode}
//                                                 </div>
                                                
//                                                 <div className="grid grid-cols-2 gap-4 text-sm">
//                                                     <div>
//                                                         <span className="text-gray-500">Format:</span>
//                                                         <div className="font-medium text-gray-700">{barcodeType}</div>
//                                                     </div>
//                                                     <div>
//                                                         <span className="text-gray-500">Confidence:</span>
//                                                         <div className="font-medium text-gray-700">{confidence.toFixed(1)}%</div>
//                                                     </div>
//                                                 </div>
                                                
//                                                 {validationStatus && (
//                                                     <div className={`mt-3 p-3 rounded-lg text-sm font-medium ${
//                                                         validationStatus.includes('Valid') 
//                                                             ? 'bg-green-100 text-green-800' 
//                                                             : 'bg-yellow-100 text-yellow-800'
//                                                     }`}>
//                                                         {validationStatus}
//                                                     </div>
//                                                 )}
//                                             </div>

//                                             {/* Product Information */}
//                                             {productDetails && (
//                                                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
//                                                     <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
//                                                         <Check className="w-5 h-5 text-blue-500 mr-2" />
//                                                         Product Information
//                                                     </h4>
                                                    
//                                                     <div className="grid gap-4">
//                                                         <div>
//                                                             <h5 className="text-lg font-semibold text-gray-800">{productDetails.name}</h5>
//                                                             <p className="text-gray-600">{productDetails.brand}</p>
//                                                         </div>
                                                        
//                                                         {productDetails.category && (
//                                                             <div>
//                                                                 <span className="text-gray-500 text-sm">Category:</span>
//                                                                 <div className="text-gray-700">{productDetails.category}</div>
//                                                             </div>
//                                                         )}
                                                        
//                                                         {productDetails.ingredients && (
//                                                             <div>
//                                                                 <span className="text-gray-500 text-sm">Ingredients:</span>
//                                                                 <div className="text-gray-700 text-sm mt-1">{productDetails.ingredients}</div>
//                                                             </div>
//                                                         )}
                                                        
//                                                         {productDetails.imageUrl && (
//                                                             <div>
//                                                                 <img 
//                                                                     src={productDetails.imageUrl} 
//                                                                     alt="Product" 
//                                                                     className="w-32 h-32 object-cover rounded-lg border"
//                                                                 />
//                                                             </div>
//                                                         )}
                                                        
//                                                         <div className="text-xs text-gray-500">
//                                                             Source: {productDetails.source}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     )}

//                                     {error && (
//                                         <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-6 border border-red-200">
//                                             <div className="flex items-center">
//                                                 <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
//                                                 <div>
//                                                     <h4 className="font-medium text-red-800 mb-1">Detection Failed</h4>
//                                                     <p className="text-red-700 text-sm">{error}</p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Tips Section */}
//                 <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
//                     <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Professional Tips for Best Results</h3>
//                     <div className="grid md:grid-cols-3 gap-6">
//                         {[
//                             {
//                                 icon: <Camera className="w-8 h-8 text-blue-500" />,
//                                 title: 'Perfect Lighting',
//                                 description: 'Use natural light or bright, even illumination. Avoid shadows and glare on the barcode surface.'
//                             },
//                             {
//                                 icon: <Zap className="w-8 h-8 text-green-500" />,
//                                 title: 'Sharp Focus',
//                                 description: 'Ensure the barcode is in sharp focus. The individual bars should be clearly visible and well-defined.'
//                             },
//                             {
//                                 icon: <Check className="w-8 h-8 text-purple-500" />,
//                                 title: 'Proper Alignment',
//                                 description: 'Hold the camera parallel to the barcode. Fill at least 60% of the image with the barcode for optimal results.'
//                             }
//                         ].map((tip, index) => (
//                             <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
//                                 <div className="bg-gradient-to-r from-blue-100 to-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
//                                     {tip.icon}
//                                 </div>
//                                 <h4 className="font-semibold text-gray-800 mb-2">{tip.title}</h4>
//                                 <p className="text-gray-600 text-sm leading-relaxed">{tip.description}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Footer */}
//                 <div className="mt-8 text-center text-gray-500 text-sm">
//                     <p>Professional Barcode Scanner supports UPC-A, UPC-E, EAN-8, EAN-13, Code 128, Code 39, Codabar, and more.</p>
//                     <p className="mt-1">Advanced validation ensures authenticity and detects potentially fake barcodes.</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProfessionalBarcodeScanner;