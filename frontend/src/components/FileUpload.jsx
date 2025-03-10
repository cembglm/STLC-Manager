import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { clsx } from 'clsx';

const FILE_TYPES = [
  'Technical Design Document',
  'Requirement Document',
  'Source Code',
  'Test Cases',
  'Test Scripts',
  'Test Data',
  'Configuration Files',
  'Previous Process Output'
];

export default function FileUpload({ 
  onFileUpload,
  managedFiles = [],
  fileProcessMappings = {},
  onFileProcessMapping,
  onFileDelete,
  processes = [],
  selectedFileIds,
  setSelectedFileIds
}) {
  const [selectedFileType, setSelectedFileType] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (!selectedFileType) {
        alert('Please select a file type before uploading');
        return;
      }
      onFileUpload(acceptedFiles, selectedFileType);
    },
    multiple: true
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">File Upload</h3>
        
        {/* File Type Selection */}
        <div className="mb-4">
          <label htmlFor="fileType" className="block text-sm font-medium text-gray-700 mb-2">
            Select File Type *
          </label>
          <select
            id="fileType"
            value={selectedFileType}
            onChange={(e) => setSelectedFileType(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Choose a file type...</option>
            {FILE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={clsx(
            'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
            isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
          )}
        >
          <input {...getInputProps()} />
          <p className="text-sm text-gray-600">
            {isDragActive ? 'Drop the files here...' : 'Drag and drop files here, or click to select files'}
          </p>
        </div>
      </div>

      {/* File List */}
      {managedFiles.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Files</h3>
          <div className="space-y-4">
            {managedFiles.map((file) => (
              <div 
                key={file.id} 
                className={clsx(
                  'p-4 rounded-lg border',
                  selectedFileIds.has(file.id) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedFileIds.has(file.id)}
                      onChange={() => {
                        setSelectedFileIds(prev => {
                          const newSet = new Set(prev);
                          if (newSet.has(file.id)) {
                            newSet.delete(file.id);
                          } else {
                            newSet.add(file.id);
                          }
                          return newSet;
                        });
                      }}
                      className="rounded text-indigo-600"
                    />
                    <div>
                      <span className="font-medium">{file.name}</span>
                      <span className="ml-2 text-sm text-gray-500">({file.type})</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onFileDelete(file.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>

                <div className="mt-3">
                  <p className="text-sm text-gray-500 mb-2">Associated Processes:</p>
                  <div className="flex flex-wrap gap-2">
                    {processes.map(process => (
                      <button
                        key={process.id}
                        onClick={() => {
                          const currentProcesses = fileProcessMappings[file.id] || [];
                          const updatedProcesses = currentProcesses.includes(process.id)
                            ? currentProcesses.filter(p => p !== process.id)
                            : [...currentProcesses, process.id];
                          onFileProcessMapping(file.id, updatedProcesses);
                        }}
                        className={clsx(
                          'px-3 py-1 rounded-full text-sm transition-colors',
                          fileProcessMappings[file.id]?.includes(process.id)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        )}
                      >
                        {process.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}