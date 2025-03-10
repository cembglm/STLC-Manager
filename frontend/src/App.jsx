import React, { useState } from 'react';
import Header from './components/Header';
import TabPanel from './components/TabPanel';
import { processes } from './data/processes';
import { codeReviewService } from './services/codeReviewService';

export default function App() {
  const [selectedProcesses, setSelectedProcesses] = useState(new Set());
  const [processFiles, setProcessFiles] = useState({});
  const [processPrompts, setProcessPrompts] = useState({});
  const [output, setOutput] = useState(null);
  const [pipelineStatus, setPipelineStatus] = useState({});
  const [activeTab, setActiveTab] = useState('pipeline');
  const [validationError, setValidationError] = useState(null);

  // New states for centralized file management
  const [managedFiles, setManagedFiles] = useState([]);
  const [fileProcessMappings, setFileProcessMappings] = useState({});
  const [selectedFileIds, setSelectedFileIds] = useState(new Set());

  const handleFileUpload = async (files, fileType) => {
    try {
      const newFiles = await Promise.all(
        Array.from(files).map(async file => {
          const fileData = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: fileType || file.type,
            size: file.size,
            content: await file.text(),
            uploadDate: new Date().toISOString()
          };
          return fileData;
        })
      );

      setManagedFiles(prev => [...prev, ...newFiles]);
    } catch (error) {
      console.error('File upload error:', error);
      setValidationError('An error occurred while uploading the file');
    }
  };

  const handlePromptUpdate = (processId, newPrompt) => {
    setProcessPrompts(prev => ({
      ...prev,
      [processId]: newPrompt
    }));
  };

  const handleProcessSelect = (processId) => {
    setSelectedProcesses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(processId)) {
        newSet.delete(processId);
      } else {
        newSet.add(processId);
      }
      return newSet;
    });
  };

  const validatePipeline = () => {
    const missingInputs = [];
    
    selectedProcesses.forEach(processId => {
      const process = processes.find(p => p.id === processId);
      const files = processFiles[processId] || [];
      
      const missingRequiredInputs = process.inputs.filter(input => {
        return !files.some(file => file.type === input);
      });
      
      if (missingRequiredInputs.length > 0) {
        missingInputs.push({
          process: process.name,
          inputs: missingRequiredInputs
        });
      }
    });
    
    return missingInputs;
  };

  // Function to delete a file
  const handleFileDelete = (fileId) => {
    setManagedFiles(prev => prev.filter(f => f.id !== fileId));
    setFileProcessMappings(prev => {
      const newMappings = { ...prev };
      delete newMappings[fileId];
      return newMappings;
    });
  };

  // Function to map files to processes
  const handleFileProcessMapping = (fileId, processes) => {
    setFileProcessMappings(prev => ({
      ...prev,
      [fileId]: processes
    }));
    
    // Automatically update process files
    processes.forEach(processId => {
      const fileInfo = managedFiles.find(f => f.id === fileId);
      if (fileInfo) {
        setProcessFiles(prev => ({
          ...prev,
          [processId]: [...(prev[processId] || []), fileInfo]
        }));
      }
    });
  };

  const handleProcessRun = async (processId) => {
    try {
      setPipelineStatus(prev => ({
        ...prev,
        [processId]: 'running'
      }));

      const relevantFiles = managedFiles.filter(file => 
        fileProcessMappings[file.id]?.includes(processId)
      );

      let result;
      if (processId === 'code_review') {
        result = await codeReviewService.runCodeReview(relevantFiles);
        setOutput({
          content: result.reviews.map(review => 
            `## ${review.file_name}\n\n${review.review}\n\n---\n`
          ).join('\n'),
          status: result.status,
          processType: 'Code Review',
          timestamp: new Date().toISOString()
        });
      }

      setPipelineStatus(prev => ({
        ...prev,
        [processId]: 'completed'
      }));
    } catch (error) {
      console.error('Process execution error:', error);
      setValidationError(`Process failed: ${error.message}`);
      setPipelineStatus(prev => ({
        ...prev,
        [processId]: 'error'
      }));
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex overflow-hidden">
        <TabPanel
          processes={processes}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedProcesses={selectedProcesses}
          onProcessSelect={handleProcessSelect}
          processFiles={processFiles}
          onFileUpload={handleFileUpload}
          processPrompts={processPrompts}
          onPromptUpdate={handlePromptUpdate}
          pipelineStatus={pipelineStatus}
          onRun={handleProcessRun}
          validationError={validationError}
          output={output}
          managedFiles={managedFiles}
          fileProcessMappings={fileProcessMappings}
          onFileProcessMapping={handleFileProcessMapping}
          onFileDelete={handleFileDelete}
          selectedFileIds={selectedFileIds}
          setSelectedFileIds={setSelectedFileIds}
        />
      </main>
    </div>
  );
}