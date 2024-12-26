import React, { useState } from 'react';
import { useGlobalSettingsStore } from '../../stores/globalSettingsStore';
import { Upload, Trash2, Save, CheckCircle } from 'lucide-react';

export const GlobalSettings: React.FC = () => {
  const {
    clinicName, clinicPhone, clinicAddress, clinicEmail, clinicWebsite, clinicLogo, clinicBanner,
    labName, labPhone, labAddress, labEmail, labWebsite, labLogo, labBanner,
    pharmacyName, pharmacyPhone, pharmacyAddress, pharmacyEmail, pharmacyWebsite, pharmacyLogo, pharmacyBanner,
    currency,
    updateClinicSettings,
    updateLabSettings,
    updatePharmacySettings,
    updateCurrency
  } = useGlobalSettingsStore();

  const [activeTab, setActiveTab] = useState<'clinic' | 'lab' | 'pharmacy' | 'currency'>('clinic');

  const [savedSections, setSavedSections] = useState<{
    clinic: boolean;
    lab: boolean;
    pharmacy: boolean;
    currency: boolean;
  }>({
    clinic: true,
    lab: true,
    pharmacy: true,
    currency: true
  });

  const [localClinicSettings, setLocalClinicSettings] = useState({
    clinicName: clinicName,
    clinicPhone: clinicPhone,
    clinicAddress: clinicAddress,
    clinicEmail: clinicEmail,
    clinicWebsite: clinicWebsite,
    clinicLogo: clinicLogo,
    clinicBanner: clinicBanner
  });

  const [localLabSettings, setLocalLabSettings] = useState({
    labName: labName,
    labPhone: labPhone,
    labAddress: labAddress,
    labEmail: labEmail,
    labWebsite: labWebsite,
    labLogo: labLogo,
    labBanner: labBanner
  });

  const [localPharmacySettings, setLocalPharmacySettings] = useState({
    pharmacyName: pharmacyName,
    pharmacyPhone: pharmacyPhone,
    pharmacyAddress: pharmacyAddress,
    pharmacyEmail: pharmacyEmail,
    pharmacyWebsite: pharmacyWebsite,
    pharmacyLogo: pharmacyLogo,
    pharmacyBanner: pharmacyBanner
  });

  const [localCurrency, setLocalCurrency] = useState(currency);

  const handleImageUpload = (type: 'clinic' | 'lab' | 'pharmacy', imageType: 'logo' | 'banner', base64Image: string) => {
    try {
      console.log(`Uploading ${type} ${imageType}:`, base64Image ? base64Image.substring(0, 50) + '...' : 'No image');
      
      switch (type) {
        case 'clinic':
          setLocalClinicSettings(prev => {
            console.log('Previous clinic settings:', prev);
            const newSettings = { 
              ...prev, 
              [`clinic${imageType.charAt(0).toUpperCase() + imageType.slice(1)}`]: base64Image 
            };
            console.log('New clinic settings:', newSettings);
            return newSettings;
          });
          setSavedSections(prev => ({ ...prev, clinic: false }));
          break;
        case 'lab':
          setLocalLabSettings(prev => {
            console.log('Previous lab settings:', prev);
            const newSettings = { 
              ...prev, 
              [`lab${imageType.charAt(0).toUpperCase() + imageType.slice(1)}`]: base64Image 
            };
            console.log('New lab settings:', newSettings);
            return newSettings;
          });
          setSavedSections(prev => ({ ...prev, lab: false }));
          break;
        case 'pharmacy':
          setLocalPharmacySettings(prev => {
            console.log('Previous pharmacy settings:', prev);
            const newSettings = { 
              ...prev, 
              [`pharmacy${imageType.charAt(0).toUpperCase() + imageType.slice(1)}`]: base64Image 
            };
            console.log('New pharmacy settings:', newSettings);
            return newSettings;
          });
          setSavedSections(prev => ({ ...prev, pharmacy: false }));
          break;
      }
    } catch (error) {
      console.error('Error in handleImageUpload:', error);
    }
  };

  const handleRemoveImage = (type: 'clinic' | 'lab' | 'pharmacy', imageType: 'logo' | 'banner') => {
    try {
      switch (type) {
        case 'clinic':
          setLocalClinicSettings(prev => ({ ...prev, [`clinic${imageType.charAt(0).toUpperCase() + imageType.slice(1)}`]: '' }));
          setSavedSections(prev => ({ ...prev, clinic: false }));
          break;
        case 'lab':
          setLocalLabSettings(prev => ({ ...prev, [`lab${imageType.charAt(0).toUpperCase() + imageType.slice(1)}`]: '' }));
          setSavedSections(prev => ({ ...prev, lab: false }));
          break;
        case 'pharmacy':
          setLocalPharmacySettings(prev => ({ ...prev, [`pharmacy${imageType.charAt(0).toUpperCase() + imageType.slice(1)}`]: '' }));
          setSavedSections(prev => ({ ...prev, pharmacy: false }));
          break;
      }
    } catch (error) {
      console.error('Error in handleRemoveImage:', error);
    }
  };

  const renderImageUploader = (type: 'clinic' | 'lab' | 'pharmacy', imageType: 'logo' | 'banner', currentImage: string) => {
    // Validate image size
    const validateImageSize = (base64Image: string): boolean => {
      // Convert base64 to bytes
      const base64Size = base64Image.length * (3/4);
      
      // Max file size: 5MB
      const MAX_FILE_SIZE = 5 * 1024 * 1024; 
      
      if (base64Size > MAX_FILE_SIZE) {
        alert(`Image is too large. Maximum file size is 5MB. Current size: ${(base64Size / 1024 / 1024).toFixed(2)}MB`);
        return false;
      }
      return true;
    };

    // Construct the full property name
    const fullPropertyName = `${type}${imageType.charAt(0).toUpperCase() + imageType.slice(1)}`;

    return (
      <div className="flex flex-col items-center space-y-2">
        {currentImage ? (
          <div className="relative group">
            <img 
              src={currentImage} 
              alt={`${type} ${imageType}`} 
              className="w-48 h-48 object-cover rounded-lg transition-opacity group-hover:opacity-70"
              onError={(e) => {
                console.error(`Error loading ${fullPropertyName}:`, e);
                // Optional: set a default placeholder image
                (e.target as HTMLImageElement).src = '/path/to/default-image.png';
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleRemoveImage(type, imageType)}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 flex items-center"
              >
                <Trash2 className="h-5 w-5" />
                <span className="ml-2 text-sm">Remove</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <div className="flex space-x-2">
          <button
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e: any) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (loadEvent) => {
                    const base64Image = loadEvent.target?.result as string;
                    
                    // Validate image size before processing
                    if (validateImageSize(base64Image)) {
                      handleImageUpload(type, imageType, base64Image);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              };
              input.click();
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Upload className="h-4 w-4" />
            <span>Upload {imageType.charAt(0).toUpperCase() + imageType.slice(1)}</span>
          </button>
        </div>
      </div>
    );
  };

  const handleSaveClinic = () => {
    try {
      updateClinicSettings(localClinicSettings);
      setSavedSections(prev => ({ ...prev, clinic: true }));
    } catch (error) {
      console.error('Error in handleSaveClinic:', error);
    }
  };

  const handleSaveLab = () => {
    try {
      updateLabSettings(localLabSettings);
      setSavedSections(prev => ({ ...prev, lab: true }));
    } catch (error) {
      console.error('Error in handleSaveLab:', error);
    }
  };

  const handleSavePharmacy = () => {
    try {
      updatePharmacySettings(localPharmacySettings);
      setSavedSections(prev => ({ ...prev, pharmacy: true }));
    } catch (error) {
      console.error('Error in handleSavePharmacy:', error);
    }
  };

  const handleSaveCurrency = () => {
    try {
      updateCurrency(localCurrency);
      setSavedSections(prev => ({ ...prev, currency: true }));
    } catch (error) {
      console.error('Error in handleSaveCurrency:', error);
    }
  };

  const renderTab = () => {
    try {
      switch (activeTab) {
        case 'clinic':
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Clinic Details</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Clinic Name"
                    value={localClinicSettings.clinicName}
                    onChange={(e) => {
                      setLocalClinicSettings(prev => ({ ...prev, clinicName: e.target.value }));
                      setSavedSections(prev => ({ ...prev, clinic: false }));
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                  />
                  <input
                    type="tel"
                    placeholder="Clinic Phone"
                    value={localClinicSettings.clinicPhone}
                    onChange={(e) => {
                      setLocalClinicSettings(prev => ({ ...prev, clinicPhone: e.target.value }));
                      setSavedSections(prev => ({ ...prev, clinic: false }));
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                  />
                  <input
                    type="text"
                    placeholder="Clinic Address"
                    value={localClinicSettings.clinicAddress}
                    onChange={(e) => {
                      setLocalClinicSettings(prev => ({ ...prev, clinicAddress: e.target.value }));
                      setSavedSections(prev => ({ ...prev, clinic: false }));
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                  />
                  <input
                    type="email"
                    placeholder="Clinic Email"
                    value={localClinicSettings.clinicEmail}
                    onChange={(e) => {
                      setLocalClinicSettings(prev => ({ ...prev, clinicEmail: e.target.value }));
                      setSavedSections(prev => ({ ...prev, clinic: false }));
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                  />
                  <input
                    type="url"
                    placeholder="Clinic Website"
                    value={localClinicSettings.clinicWebsite}
                    onChange={(e) => {
                      setLocalClinicSettings(prev => ({ ...prev, clinicWebsite: e.target.value }));
                      setSavedSections(prev => ({ ...prev, clinic: false }));
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Clinic Branding</h3>
                <div className="space-y-6">
                  {renderImageUploader('clinic', 'logo', localClinicSettings.clinicLogo)}
                  {renderImageUploader('clinic', 'banner', localClinicSettings.clinicBanner)}
                </div>
                <button
                  onClick={handleSaveClinic}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 mt-4"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Clinic Settings</span>
                </button>
                {!savedSections.clinic && (
                  <div className="text-yellow-500 text-sm mt-2">
                    Unsaved changes
                  </div>
                )}
              </div>
            </div>
          );
        case 'lab':
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Lab Details</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Lab Name"
                    value={localLabSettings.labName}
                    onChange={(e) => {
                      setLocalLabSettings(prev => ({ ...prev, labName: e.target.value }));
                      setSavedSections(prev => ({ ...prev, lab: false }));
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                  />
                  <input
                    type="tel"
                    placeholder="Lab Phone"
                    value={localLabSettings.labPhone}
                    onChange={(e) => {
                      setLocalLabSettings(prev => ({ ...prev, labPhone: e.target.value }));
                      setSavedSections(prev => ({ ...prev, lab: false }));
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                  />
                  <input
                    type="text"
                    placeholder="Lab Address"
                    value={localLabSettings.labAddress}
                    onChange={(e) => {
                      setLocalLabSettings(prev => ({ ...prev, labAddress: e.target.value }));
                      setSavedSections(prev => ({ ...prev, lab: false }));
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                  />
                  <input
                    type="email"
                    placeholder="Lab Email"
                    value={localLabSettings.labEmail}
                    onChange={(e) => {
                      setLocalLabSettings(prev => ({ ...prev, labEmail: e.target.value }));
                      setSavedSections(prev => ({ ...prev, lab: false }));
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                  />
                  <input
                    type="url"
                    placeholder="Lab Website"
                    value={localLabSettings.labWebsite}
                    onChange={(e) => {
                      setLocalLabSettings(prev => ({ ...prev, labWebsite: e.target.value }));
                      setSavedSections(prev => ({ ...prev, lab: false }));
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Lab Branding</h3>
                <div className="space-y-6">
                  {renderImageUploader('lab', 'logo', localLabSettings.labLogo)}
                  {renderImageUploader('lab', 'banner', localLabSettings.labBanner)}
                </div>
                <button
                  onClick={handleSaveLab}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 mt-4"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Lab Settings</span>
                </button>
                {!savedSections.lab && (
                  <div className="text-yellow-500 text-sm mt-2">
                    Unsaved changes
                  </div>
                )}
              </div>
            </div>
          );
        case 'pharmacy':
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Pharmacy Details</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Pharmacy Name"
                    value={localPharmacySettings.pharmacyName}
                    onChange={(e) => {
                      setLocalPharmacySettings(prev => ({ ...prev, pharmacyName: e.target.value }));
                      setSavedSections(prev => ({ ...prev, pharmacy: false }));
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                  />
                  <input
                    type="tel"
                    placeholder="Pharmacy Phone"
                    value={localPharmacySettings.pharmacyPhone}
                    onChange={(e) => {
                      setLocalPharmacySettings(prev => ({ ...prev, pharmacyPhone: e.target.value }));
                      setSavedSections(prev => ({ ...prev, pharmacy: false }));
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                  />
                  <input
                    type="text"
                    placeholder="Pharmacy Address"
                    value={localPharmacySettings.pharmacyAddress}
                    onChange={(e) => {
                      setLocalPharmacySettings(prev => ({ ...prev, pharmacyAddress: e.target.value }));
                      setSavedSections(prev => ({ ...prev, pharmacy: false }));
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                  />
                  <input
                    type="email"
                    placeholder="Pharmacy Email"
                    value={localPharmacySettings.pharmacyEmail}
                    onChange={(e) => {
                      setLocalPharmacySettings(prev => ({ ...prev, pharmacyEmail: e.target.value }));
                      setSavedSections(prev => ({ ...prev, pharmacy: false }));
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                  />
                  <input
                    type="url"
                    placeholder="Pharmacy Website"
                    value={localPharmacySettings.pharmacyWebsite}
                    onChange={(e) => {
                      setLocalPharmacySettings(prev => ({ ...prev, pharmacyWebsite: e.target.value }));
                      setSavedSections(prev => ({ ...prev, pharmacy: false }));
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Pharmacy Branding</h3>
                <div className="space-y-6">
                  {renderImageUploader('pharmacy', 'logo', localPharmacySettings.pharmacyLogo)}
                  {renderImageUploader('pharmacy', 'banner', localPharmacySettings.pharmacyBanner)}
                </div>
                <button
                  onClick={handleSavePharmacy}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 mt-4"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Pharmacy Settings</span>
                </button>
                {!savedSections.pharmacy && (
                  <div className="text-yellow-500 text-sm mt-2">
                    Unsaved changes
                  </div>
                )}
              </div>
            </div>
          );
        case 'currency':
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Currency Settings</h3>
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">
                  Select Currency
                </label>
                <select
                  value={localCurrency}
                  onChange={(e) => {
                    setLocalCurrency(e.target.value);
                    setSavedSections(prev => ({ ...prev, currency: false }));
                  }}
                  className="w-64 rounded-md border-gray-300 shadow-sm"
                >
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                  <option value="AUD">Australian Dollar (A$)</option>
                </select>
              </div>
              <button
                onClick={handleSaveCurrency}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 mt-4"
              >
                <Save className="h-4 w-4" />
                <span>Save Currency Settings</span>
              </button>
              {!savedSections.currency && (
                <div className="text-yellow-500 text-sm mt-2">
                  Unsaved changes
                </div>
              )}
            </div>
          );
      }
    } catch (error) {
      console.error('Error in renderTab:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Global Settings</h2>
      
      <div className="flex border-b mb-6">
        {[
          { key: 'clinic', label: 'Clinic' },
          { key: 'lab', label: 'Lab' },
          { key: 'pharmacy', label: 'Pharmacy' },
          { key: 'currency', label: 'Currency' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 ${
              activeTab === tab.key 
                ? 'border-b-2 border-indigo-600 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {renderTab()}
      </div>
    </div>
  );
};
