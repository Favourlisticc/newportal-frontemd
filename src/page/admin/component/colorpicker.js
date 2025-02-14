import React, { useState, useEffect } from 'react';

const ColorPicker = ({ onColorChange }) => {
  const [bgColor, setBgColor] = useState('#002657');
  const [textColor, setTextColor] = useState('#E5B30F');

  useEffect(() => {
    // Load saved colors from localStorage
    const savedBgColor = localStorage.getItem('adminBgColor') || '#002657';
    const savedTextColor = localStorage.getItem('adminTextColor') || '#E5B30F';
    setBgColor(savedBgColor);
    setTextColor(savedTextColor);
    onColorChange(savedBgColor, savedTextColor);
  }, [onColorChange]);

  const handleBgColorChange = (e) => {
    const color = e.target.value;
    setBgColor(color);
    localStorage.setItem('adminBgColor', color);
    onColorChange(color, textColor);
  };

  const handleTextColorChange = (e) => {
    const color = e.target.value;
    setTextColor(color);
    localStorage.setItem('adminTextColor', color);
    onColorChange(bgColor, color);
  };

  return (
    <div className="p-4 bg-gray-700 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Customize Colors</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Background Color</label>
          <input
            type="color"
            value={bgColor}
            onChange={handleBgColorChange}
            className="w-full h-10 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Text Color</label>
          <input
            type="color"
            value={textColor}
            onChange={handleTextColorChange}
            className="w-full h-10 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;