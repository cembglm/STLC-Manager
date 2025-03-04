import React, { useState } from 'react';
import Header from './components/Header';
import TabPanel from './components/TabPanel';
import { processes } from './data/processes';
import { processService } from './services/processService';
import { codeReviewService } from './services/codeReviewService';

export default function App() {
  const [selectedProcesses, setSelectedProcesses] = useState(new Set());
  const [processFiles, setProcessFiles] = useState({});
  const [processPrompts, setProcessPrompts] = useState({});
  const [output, setOutput] = useState(null);
  const [pipelineStatus, setPipelineStatus] = useState({});
  const [activeTab, setActiveTab] = useState('pipeline');
  const [validationError, setValidationError] = useState(null);

  const handleFileUpload = (processId, fileInfo) => {
    setProcessFiles(prev => ({
      ...prev,
      [processId]: [...(prev[processId] || []), fileInfo]
    }));
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

  const handleProcessRun = async (processId, files) => {
    try {
      setPipelineStatus(prev => ({
        ...prev,
        [processId]: 'running'
      }));

      let result;
      if (processId === 'code_review') {  // Using underscore
        result = await processService.runCodeReview(files);
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
      console.error('Process execution failed:', error);
      window.alert(`Process failed: ${error.message}`);
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
        />
      </main>
    </div>
  );
}