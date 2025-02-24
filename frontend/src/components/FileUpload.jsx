import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { clsx } from 'clsx';

const fileTypes = [
  'Technical Design Document',
  'Requirement Document',
  'Source Code',
  'Previous Process Output',
  'Test Cases',
  'Test Scripts',
  'Test Data',
  'Configuration Files'
];

export default function FileUpload({ 
  onFilesSelected, 
  processId, 
  existingFiles = [], 
  allowMultiple = true 
}) {
  const [selectedType, setSelectedType] = useState('');
  const [tempFiles, setTempFiles] = useState([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (selectedType) {
        setTempFiles(acceptedFiles);
      } else {
        alert('Please select a file type before uploading');
      }
    },
    multiple: allowMultiple,
    accept: {
      'application/json': ['.json'],
      'text/plain': ['.txt'],
      'text/javascript': ['.js', '.jsx'],
      'text/python': ['.py'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx']
    }
  });

  const handleSave = () => {
    if (tempFiles.length > 0 && selectedType) {
      tempFiles.forEach(file => {
        onFilesSelected(processId, {
          file,
          type: selectedType
        });
      });
      setTempFiles([]);
      setSelectedType('');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          File Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select file type...</option>
          {fileTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {existingFiles && existingFiles.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-md space-y-2">
          <h4 className="text-sm font-medium text-blue-700">Uploaded Files:</h4>
          {existingFiles.map((fileInfo, index) => (
            <div key={index} className="text-sm text-blue-700">
              {fileInfo.file ? `${fileInfo.file.name} (${fileInfo.type})` : `${fileInfo.type}`}
            </div>
          ))}
        </div>
      )}

      <div
        {...getRootProps()}
        className={clsx(
          'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer',
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
        )}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-gray-600">
          {isDragActive ? 'Drop the files here...' : 'Drag & drop files here, or click to select'}
        </p>
      </div>

      {tempFiles.length > 0 && (
        <div className="space-y-2">
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
            {tempFiles.map((file, index) => (
              <div key={index} className="text-sm text-gray-600">
                {file.name}
              </div>
            ))}
          </div>
          <button
            onClick={handleSave}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Save Files
          </button>
        </div>
      )}
    </div>
  );
}