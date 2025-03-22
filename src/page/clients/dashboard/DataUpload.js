import React, { useState, useRef, useEffect } from 'react';

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



  return (
    <div className="min-h-screen bg-gray-100 py-6 max-sm:py-3 flex flex-col justify-center sm:py-12">
      <div className="relative w-full px-4 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="mb-8 text-2xl sm:text-3xl font-bold text-center">Client Dashboard</h1>

          {/* Upload Documents Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Upload Documents</h2>
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              className="mb-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
            <button
              onClick={handleUpload}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            >
              Upload
            </button>
            <ul className="mt-2">
              {files.map((file, index) => (
                <li key={index} className="text-sm sm:text-base">{file}</li>
              ))}
            </ul>
          </div>

         
        </div>
      </div>
    </div>
  );
}

export default DataUploadPage;