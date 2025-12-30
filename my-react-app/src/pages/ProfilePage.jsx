
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';



const constructUrl = (type, value) => {
  if (!value) return '#'; 
  
 
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }
  
  
  switch (type) {
    case 'website':
      return `https://${value}`;
    case 'linkedin':
      
      return `https://www.linkedin.com/in/${value}`;
    case 'instagram':
      return `https://www.instagram.com/${value}`;
    case 'github':
      return `https://github.com/${value}`;
    case 'twitter':
      return `https://twitter.com/${value}`;
    default:
      return value; 
  }
};


const ActionButton = ({ field, profileId }) => {
  switch (field.type) {
    case 'phone':
      return (
        <>
          <a href={`https://wa.me/${field.value.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="action-button whatsapp">Chat on WhatsApp</a>
          <a href={`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/profile/${profileId}/vcard`} className="action-button">Save Contact</a>
        </>
      );
    case 'email':
      return <a href={`mailto:${field.value}`} className="action-button">Send Email</a>;
    case 'website':
      return <a href={constructUrl(field.type, field.value)} target="_blank" rel="noopener noreferrer" className="action-button social">Visit Website</a>;
    case 'linkedin':
    case 'github':
    case 'twitter':
    case 'instagram':
       return <a href={constructUrl(field.type, field.value)} target="_blank" rel="noopener noreferrer" className="action-button social">View Profile</a>;
    case 'upi':
      return <a href={`upi://pay?pa=${field.value}`} className="action-button upi">Pay with UPI</a>;
    default:
      return null;
  }
};


function ProfilePage() {
  const { profileId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/profile/${profileId}`);
        if (!response.ok) {
          throw new Error('Profile not found! This QR code may be invalid.');
        }
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [profileId]);

  if (loading) {
    return <div className="status-message">Loading Profile...</div>;
  }

  if (error) {
    return <div className="status-message error-message">{error}</div>;
  }

  return (
    <div className="profile-container">
      {profileData && (
        <>
          <div className="profile-header">
            <h1>{profileData.name}</h1>
          </div>
          <div className="actions-grid">
          
            {profileData.fields.map((field, index) => (
              <div className="action-card" key={index}>
                <p>{field.type}</p>
                <h3>{field.value}</h3>
                <ActionButton field={field} profileId={profileId} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProfilePage;