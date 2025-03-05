import React, { useState } from 'react';
import { Drive } from 'lucide-react'; // Updated import
import GoogleDrivePicker from './GoogleDrivePicker';

interface GoogleDriveButtonProps {
  onFileSelected: (file: File) => void;
  allowedMimeTypes?: string[];
}

const GoogleDriveButton: React.FC<GoogleDriveButtonProps> = ({ onFileSelected, allowedMimeTypes }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleFileSelected = (file: File) => {
    onFileSelected(file);
    setShowPicker(false);
  };

  return (
    <>
      <button
        onClick={() => setShowPicker(true)}
        type="button"
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4]"
      >
        <Drive className="h-5 w-5 mr-2 text-[#4285F4]" />
        Import from Google Drive
      </button>

      {showPicker && (
        <GoogleDrivePicker
          onFileSelected={handleFileSelected}
          onClose={() => setShowPicker(false)}
          allowedMimeTypes={allowedMimeTypes}
        />
      )}
    </>
  );
};

export default GoogleDriveButton;
