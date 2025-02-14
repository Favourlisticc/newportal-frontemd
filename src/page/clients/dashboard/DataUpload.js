// components/DataUploadPage.js
import React, { useState, useRef } from 'react';

function DataUploadPage() {
  const [files, setFiles] = useState([]);
  const [signature, setSignature] = useState(false);
  const canvasRef = useRef(null);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files).map(file => file.name));
  };

  const handleUpload = () => {
    alert("Files would be uploaded here in a real application.");
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    canvas.onmousemove = draw;
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    canvas.onmousemove = null;
  };

  const draw = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature(false);
  };

  const signContract = () => {
    const canvas = canvasRef.current;
    if (canvas.toDataURL() !== 'data:,' ) {
      setSignature(true);
    } else {
      alert('Please sign before submitting.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="mb-8 text-3xl font-bold text-center">Client Dashboard</h1>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Upload Documents</h2>
            <input type="file" onChange={handleFileChange} multiple className="mb-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" />
            <button onClick={handleUpload} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">Upload</button>
            <ul className="mt-2">
              {files.map((file, index) => (
                <li key={index}>{file}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Digital Signature</h2>
            <canvas 
              ref={canvasRef} 
              width="400" 
              height="200" 
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="border border-gray-300 mb-2"
            ></canvas>
            <div className="flex space-x-2">
              <button onClick={clearSignature} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none">Clear</button>
              <button onClick={signContract} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none">Sign Contract</button>
            </div>
            {signature && <p className="mt-2 text-green-500">Contract signed digitally!</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataUploadPage;