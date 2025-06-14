// import React, { useState, useEffect, useRef } from 'react';
// import Quagga from 'quagga';
// import JsBarcode from 'jsbarcode';

// const BarcodeScanner = () => {
//     const [imageSrc, setImageSrc] = useState('');
//     const [barcode, setBarcode] = useState('');
//     const [barcodeType, setBarcodeType] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [productDetails, setProductDetails] = useState(null);
//     const barcodeCanvasRef = useRef(null);

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (!file || !file.type.match('image.*')) {
//             setError('Please select an image file (JPG, PNG, GIF)');
//             return;
//         }
//         if (file.size > 5 * 1024 * 1024) {
//             setError('File size exceeds 5MB limit');
//             return;
//         }

//         const reader = new FileReader();
//         reader.onload = (event) => {
//             setImageSrc(event.target.result);
//             setBarcode('');
//             setBarcodeType('');
//             setError('');
//             scanBarcode(event.target.result);
//         };
//         reader.readAsDataURL(file);
//     };

//     const scanBarcode = (imageData) => {
//         setLoading(true);
//         Quagga.decodeSingle({
//             decoder: {
//                 readers: [
//                     'code_128_reader', 'ean_reader', 'ean_8_reader',
//                     'code_39_reader', 'code_39_vin_reader', 'codabar_reader',
//                     'upc_reader', 'upc_e_reader'
//                 ]
//             },
//             locate: true,
//             src: imageData
//         }, async (result) => {
//             setLoading(false);
//             if (result && result.codeResult) {
//                 const code = result.codeResult.code;
//                 const format = result.codeResult.format;
//                 setBarcode(code);
//                 setBarcodeType(`Type: ${format}`);

//                 // Fetch product details using the barcode value
//                 console.log('Scanned Barcode:', code);
//                 console.log('Barcode Format:', format);

//                 await fetchProductDetails(code);

//                 try {
//                     JsBarcode(barcodeCanvasRef.current, code, {
//                         format: format.toLowerCase(),
//                         lineColor: '#374151',
//                         width: 2,
//                         height: 60,
//                         displayValue: true
//                     });
//                 } catch (e) {
//                     console.error('Could not generate barcode preview:', e);
//                 }
//             } else {
//                 setError('No barcode detected. Please try another image.');
//             }
//         });
//     };

//     const fetchProductDetails = async (barcodeValue) => {
//         try {
//             const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcodeValue}.json`);
//             const data = await response.json();

//             // Check if product data exists
//             if (data.status === 1 && data.product) {
//                 const product = data.product;
//                 setProductDetails({
//                     name: product.product_name || 'Unknown Product',
//                     brand: product.brands || 'Unknown Brand',
//                     ingredients: product.ingredients_text || 'Ingredients not available',
//                     imageUrl: product.image_url || 'No image available',
//                 });
//             } else {
//                 setError('Product not found');
//             }
//         } catch (error) {
//             console.error('Error fetching product details:', error);
//             setError('Error fetching product details');
//         }
//     };

//     // const fetchProductDetails = async (barcodeValue) => {
//     //     const apiKey = "your_api_key";  // Replace with your API key from UPCItemDB (optional for trial)

//     //     try {
//     //         // Make an API request to UPCItemDB
//     //         const response = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcodeValue}`, {
//     //             method: 'GET',
//     //             headers: {
//     //                 'Content-Type': 'application/json',
//     //                 'apikey': apiKey // You might not need this if it's a trial API key
//     //             }
//     //         });

//     //         const data = await response.json();

//     //         // Check if product data exists
//     //         if (data.items && data.items.length > 0) {
//     //             const product = data.items[0];  // Assuming first result is the correct product
//     //             console.log(product);  // Log the product data for debugging

//     //             // Set the product details to display in the UI
//     //             setProductDetails({
//     //                 name: product.title || 'Unknown Product',
//     //                 brand: product.brand || 'Unknown Brand',
//     //                 description: product.description || 'Description not available',
//     //                 imageUrl: product.image_url || 'No image available',
//     //             });
//     //         } else {
//     //             setError('Product not found');
//     //         }
//     //     } catch (error) {
//     //         console.error('Error fetching product details:', error);
//     //         setError('There was an error fetching product details.');
//     //     }
//     // };



//     const copyToClipboard = () => {
//         navigator.clipboard.writeText(barcode);
//     };

//     const downloadTextFile = () => {
//         const blob = new Blob([barcode], { type: 'text/plain' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'barcode_data.txt';
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         URL.revokeObjectURL(url);
//     };

//     useEffect(() => {
//         if (barcode && barcodeCanvasRef.current) {
//             try {
//                 JsBarcode(barcodeCanvasRef.current, barcode, {
//                     format: barcodeType.toLowerCase(),
//                     lineColor: '#374151',
//                     width: 2,
//                     height: 60,
//                     displayValue: true
//                 });
//             } catch (e) {
//                 console.error('Could not generate barcode preview:', e);
//             }
//         }
//     }, [barcode, barcodeType]);

//     return (
//         <div className="bg-gray-50 min-h-screen px-4 py-12 max-w-4xl mx-auto">
//             <div className="text-center mb-12">
//                 <h1 className="text-4xl font-bold text-gray-800 mb-2">Barcode Scanner Pro</h1>
//                 <p className="text-gray-600">Upload an image containing a barcode and we'll extract the information for you</p>
//             </div>

//             <div className="bg-white rounded-xl shadow-lg p-8">
//                 <div className="dropzone rounded-lg p-12 text-center cursor-pointer">
//                     <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
//                         <i className="fas fa-barcode text-blue-500 text-2xl"></i>
//                     </div>
//                     <h3 className="text-lg font-medium text-gray-700 mb-2">Drag & drop your barcode image here</h3>
//                     <p className="text-gray-500 mb-4">or</p>
//                     <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
//                         <i className="fas fa-upload mr-2"></i> Select Image
//                         <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
//                     </label>
//                     <p className="text-gray-400 text-sm mt-3">Supports: JPG, PNG, GIF (Max 5MB)</p>
//                 </div>

//                 {imageSrc && (
//                     <div className="mt-6">
//                         <div className="flex flex-col md:flex-row gap-6">
//                             <div className="flex-1">
//                                 <h3 className="text-lg font-medium text-gray-700 mb-3">Your Image</h3>
//                                 <div className="border rounded-lg overflow-hidden">
//                                     <img src={imageSrc} alt="Preview" className="max-h-[300px] object-contain w-full" />
//                                 </div>
//                             </div>
//                             <div className="flex-1">
//                                 <h3 className="text-lg font-medium text-gray-700 mb-3">Scan Results</h3>

//                                 {loading && (
//                                     <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
//                                         <div className="animate-spin text-blue-500 text-4xl">
//                                             <i className="fas fa-circle-notch"></i>
//                                         </div>
//                                         <span className="ml-3 text-gray-600">Scanning barcode...</span>
//                                     </div>
//                                 )}

//                                 {!loading && barcode && (
//                                     <div className="bg-gray-50 rounded-lg p-6 transition-all duration-300">
//                                         <div className="flex items-center justify-between mb-4">
//                                             <h4 className="font-medium text-gray-700">Barcode Information</h4>
//                                             <div className="flex space-x-2">
//                                                 <button onClick={copyToClipboard} className="p-2 text-gray-500 hover:text-blue-500">
//                                                     <i className="far fa-copy"></i>
//                                                 </button>
//                                                 <button onClick={downloadTextFile} className="p-2 text-gray-500 hover:text-blue-500">
//                                                     <i className="fas fa-download"></i>
//                                                 </button>
//                                             </div>
//                                         </div>
//                                         <div className="bg-white p-4 rounded border border-gray-200 font-mono text-gray-800 break-words">{barcode}</div>
//                                         <div className="mt-3 text-sm text-gray-500">{barcodeType}</div>
//                                         <div className="mt-4 flex justify-center">
//                                             <canvas ref={barcodeCanvasRef}></canvas>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {productDetails && (
//                                     <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
//                                         <h3 className="text-xl font-semibold text-gray-700">{productDetails.name}</h3>
//                                         <p className="text-gray-600">Brand: {productDetails.brand}</p>
//                                         <p className="text-gray-600 mt-2">Ingredients: {productDetails.ingredients}</p>
//                                         <div className="mt-4">
//                                             {productDetails.imageUrl ? (
//                                                 <img src={productDetails.imageUrl} alt="Product" className="max-w-xs" />
//                                             ) : (
//                                                 <p>No image available</p>
//                                             )}
//                                         </div>
//                                     </div>
//                                 )}


//                                 {error && (
//                                     <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             <div className="bg-gray-50 p-8 border-t mt-6">
//                 <h3 className="text-lg font-medium text-gray-700 mb-4">How to get the best results</h3>
//                 <div className="grid md:grid-cols-3 gap-4">
//                     {[
//                         { icon: 'fa-camera', title: 'Good Lighting', text: 'Ensure the barcode is well-lit without glare' },
//                         { icon: 'fa-ruler-combined', title: 'Straight Angle', text: 'Hold your camera parallel to the barcode' },
//                         { icon: 'fa-expand', title: 'Clear Focus', text: 'Make sure the barcode fills most of the image' }
//                     ].map((tip, index) => (
//                         <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
//                             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
//                                 <i className={`fas ${tip.icon} text-blue-500`}></i>
//                             </div>
//                             <h4 className="font-medium text-gray-700 mb-1">{tip.title}</h4>
//                             <p className="text-gray-500 text-sm">{tip.text}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <div className="mt-8 text-center text-gray-400 text-sm">
//                 <p>Barcode Scanner Pro uses advanced algorithms to read various barcode formats including UPC, EAN, Code 128, and more.</p>
//             </div>
//         </div>
//     );
// };

// export default BarcodeScanner;

    // const fetchProductDetails = async (barcodeValue) => {
    //     const apiKey = "your_api_key";  // Replace with your API key from UPCItemDB (optional for trial)

    //     try {
    //         // Make an API request to UPCItemDB
    //         const response = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcodeValue}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'apikey': apiKey // You might not need this if it's a trial API key
    //             }
    //         });

    //         const data = await response.json();

    //         // Check if product data exists
    //         if (data.items && data.items.length > 0) {
    //             const product = data.items[0];  // Assuming first result is the correct product
    //             console.log(product);  // Log the product data for debugging

    //             // Set the product details to display in the UI
    //             setProductDetails({
    //                 name: product.title || 'Unknown Product',
    //                 brand: product.brand || 'Unknown Brand',
    //                 description: product.description || 'Description not available',
    //                 imageUrl: product.image_url || 'No image available',
    //             });
    //         } else {
    //             setError('Product not found');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching product details:', error);
    //         setError('There was an error fetching product details.');
    //     }
    // };

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