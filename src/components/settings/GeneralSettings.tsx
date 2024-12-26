import React, { useState, useRef, useEffect } from 'react';
import { useGeneralSettingsStore } from '../../stores/generalSettingsStore';
import { Clock, Upload } from 'lucide-react';

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export const GeneralSettings: React.FC = () => {
  const { settings, updateSettings } = useGeneralSettingsStore();
  const [formData, setFormData] = useState(settings);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Update form data when settings change
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      updateSettings(formData);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    }
  };

  const handleFileUpload = async (file: File, type: 'logo' | 'banner') => {
    try {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('File size too large. Please upload a file smaller than 5MB.');
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({
          ...prev,
          [type === 'logo' ? 'clinicLogo' : 'clinicBanner']: base64String
        }));
      };
      reader.onerror = () => {
        throw new Error('Error reading file');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(error instanceof Error ? error.message : 'Error uploading file. Please try again.');
    }
  };

  const handleTimingChange = (
    day: keyof typeof formData.clinicTimings,
    field: 'open' | 'close' | 'closed',
    value: string | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      clinicTimings: {
        ...prev.clinicTimings,
        [day]: {
          ...prev.clinicTimings[day],
          [field]: value
        }
      }
    }));
  };

  const handleInputChange = (
    field: keyof Omit<typeof formData, 'clinicTimings'>,
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 bg-white shadow rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          </div>
          
          <div>
            <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700">
              Clinic Name
            </label>
            <input
              type="text"
              id="clinicName"
              value={formData.clinicName}
              onChange={(e) => handleInputChange('clinicName', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="clinicPhone" className="block text-sm font-medium text-gray-700">
              Clinic Phone
            </label>
            <input
              type="tel"
              id="clinicPhone"
              value={formData.clinicPhone}
              onChange={(e) => handleInputChange('clinicPhone', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="clinicAddress" className="block text-sm font-medium text-gray-700">
              Clinic Address
            </label>
            <textarea
              id="clinicAddress"
              rows={3}
              value={formData.clinicAddress}
              onChange={(e) => handleInputChange('clinicAddress', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="clinicEmail" className="block text-sm font-medium text-gray-700">
              Clinic Email
            </label>
            <input
              type="email"
              id="clinicEmail"
              value={formData.clinicEmail}
              onChange={(e) => handleInputChange('clinicEmail', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="clinicWebsite" className="block text-sm font-medium text-gray-700">
              Clinic Website
            </label>
            <input
              type="url"
              id="clinicWebsite"
              value={formData.clinicWebsite}
              onChange={(e) => handleInputChange('clinicWebsite', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Associated Services */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-t pt-6">
          <div className="col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Associated Services</h3>
          </div>
          
          <div>
            <label htmlFor="labName" className="block text-sm font-medium text-gray-700">
              Lab Name
            </label>
            <input
              type="text"
              id="labName"
              value={formData.labName}
              onChange={(e) => handleInputChange('labName', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="pharmacyName" className="block text-sm font-medium text-gray-700">
              Pharmacy Name
            </label>
            <input
              type="text"
              id="pharmacyName"
              value={formData.pharmacyName}
              onChange={(e) => handleInputChange('pharmacyName', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="defaultCurrency" className="block text-sm font-medium text-gray-700">
              Default Currency
            </label>
            <select
              id="defaultCurrency"
              value={formData.defaultCurrency}
              onChange={(e) => handleInputChange('defaultCurrency', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Currency</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">British Pound (£)</option>
              <option value="INR">Indian Rupee (₹)</option>
              <option value="JPY">Japanese Yen (¥)</option>
              <option value="CAD">Canadian Dollar (CA$)</option>
              <option value="AUD">Australian Dollar (A$)</option>
            </select>
          </div>
        </div>

        {/* Clinic Timings */}
        <div className="border-t pt-6">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Clinic Timings</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="flex items-center space-x-4">
                <div className="w-24">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {day}
                  </span>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={!formData.clinicTimings[day].closed}
                    onChange={(e) => handleTimingChange(day, 'closed', !e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Open</span>
                </label>
                {!formData.clinicTimings[day].closed && (
                  <>
                    <input
                      type="time"
                      value={formData.clinicTimings[day].open}
                      onChange={(e) => handleTimingChange(day, 'open', e.target.value)}
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={formData.clinicTimings[day].close}
                      onChange={(e) => handleTimingChange(day, 'close', e.target.value)}
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Logo and Banner */}
        <div className="border-t pt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Clinic Logo</label>
              <div className="mt-1 flex items-center space-x-4">
                {formData.clinicLogo && (
                  <img
                    src={formData.clinicLogo}
                    alt="Clinic Logo"
                    className="h-16 w-16 object-contain"
                  />
                )}
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </button>
                <input
                  type="file"
                  ref={logoInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'logo');
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Clinic Banner</label>
              <div className="mt-1 flex items-center space-x-4">
                {formData.clinicBanner && (
                  <img
                    src={formData.clinicBanner}
                    alt="Clinic Banner"
                    className="h-16 w-32 object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Banner
                </button>
                <input
                  type="file"
                  ref={bannerInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'banner');
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};
