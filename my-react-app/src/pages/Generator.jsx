import React, { useState, useRef } from 'react';
import QRCode from "react-qr-code"; 
import toast from 'react-hot-toast';

const availableFieldTypes = [
  "phone", "email", "website", "linkedin", "github", 
  "twitter", "instagram", "upi"
];

function Generator() {
  const [name, setName] = useState('');
  const [fields, setFields] = useState([
    { type: 'phone', value: '' },
    { type: 'email', value: '' },
  ]);
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [fgColor, setFgColor] = useState('#000000');

  const [profileId, setProfileId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const qrCodeRef = useRef(null);

  const handleFieldChange = (index, event) => {
    const newFields = [...fields];
    newFields[index].value = event.target.value;
    setFields(newFields);
  };

  const addField = (fieldType) => {
    if (fieldType && !fields.some(field => field.type === fieldType)) {
      setFields([...fields, { type: fieldType, value: '' }]);
    }
  };

  const removeField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setProfileId('');
    
    const toastId = toast.loading('Generating your QR Code...');

    const profileData = { 
      name, 
      fields: fields.filter(field => field.value !== '')
    };

    try {
    
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/create-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();
      setProfileId(data.profile_id);
      
      toast.success('QR Code ready!', { id: toastId });

    } catch (err) {
      toast.error('Failed to create profile.', { id: toastId });
      console.error(err);
    }

    setIsLoading(false);
  };

  const handleDownload = () => {
    const svg = qrCodeRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = 256;
      canvas.height = 256;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.href = pngFile;
      downloadLink.download = `${name || 'qrcode'}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success('Download started!');
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const profileUrl = `${window.location.origin}/profile/${profileId}`;

  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl).then(() => {
      toast.success('Link copied to clipboard!');
    }, (err) => {
      toast.error('Failed to copy link.');
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <div className="generator-container">
      <h1>QwikCard</h1>
      <p>Create a single QR code for all your contact details.</p>

      <form onSubmit={handleSubmit} className="profile-form">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name (Required)" required />
        
        {fields.map((field, index) => (
          <div key={index} className="dynamic-field">
            <input
              type="text"
              value={field.value}
              onChange={(e) => handleFieldChange(index, e)}
              placeholder={field.type.charAt(0).toUpperCase() + field.type.slice(1)}
            />
            <button type="button" className="remove-btn" onClick={() => removeField(index)}>
              <TrashIcon />
            </button>
          </div>
        ))}

        <div className="add-field-container">
          <select onChange={(e) => { addField(e.target.value); e.target.value = ""; }} value="">
            <option value="" disabled>-- Add another field --</option>
            {availableFieldTypes.map(type => (
              !fields.some(f => f.type === type) && <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="color-picker-container">
          <label htmlFor="fgColor" className="color-picker">
            <span>Code Color</span>
            <div className="color-swatch" style={{ backgroundColor: fgColor }} />
            <input id="fgColor" type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} />
          </label>
          <label htmlFor="bgColor" className="color-picker">
            <span>Background Color</span>
            <div className="color-swatch" style={{ backgroundColor: bgColor }} />
            <input id="bgColor" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
          </label>
        </div>
       

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate QR Code'}
        </button>
      </form>

      {profileId && (
        <div className="qr-result">
          <h2>Your QR Code is Ready!</h2>
          <div className="qr-code-container" ref={qrCodeRef} style={{ background: bgColor }}>
             <QRCode value={profileUrl} size={256} bgColor={bgColor} fgColor={fgColor} />
          </div>
          <p>Scan this code or share the link below.</p>
          <div className="profile-link-container">
            <a href={profileUrl} target="_blank" rel="noopener noreferrer">
              {profileUrl}
            </a>
          </div>
          <div className="result-buttons">
            <button onClick={handleCopyLink} className="copy-btn">Copy Link</button>
            <button onClick={handleDownload} className="download-btn-qr">Download QR</button>
          </div>
        </div>
      )}
    </div>
  );
}

const TrashIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

export default Generator;