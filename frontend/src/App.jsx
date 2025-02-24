import React, { useState } from 'react';
import Header from './components/Header';
import TabPanel from './components/TabPanel';
import { processes } from './data/processes';

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

  const executeProcess = async (process) => {
    try {
      setPipelineStatus(prev => ({
        ...prev,
        [process.id]: 'running'
      }));

      // Simulate process execution with Promise
      const result = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            status: 'success',
            content: `# ${process.name} Results\n\n## Overview\nProcess completed successfully\n\n## Details\n- Analyzed ${processFiles[process.id]?.length || 0} files\n- Generated test artifacts\n- Validated requirements\n\n## Next Steps\n1. Review generated artifacts\n2. Proceed to next phase\n3. Update documentation`,
            timestamp: new Date().toISOString()
          });
        }, 2000);
      });

      setPipelineStatus(prev => ({
        ...prev,
        [process.id]: 'completed'
      }));

      return result;
    } catch (error) {
      setPipelineStatus(prev => ({
        ...prev,
        [process.id]: 'error'
      }));
      throw error;
    }
  };

  const handleProcessRun = async () => {
    try {
      setValidationError(null);
      const missingInputs = validatePipeline();
      
      if (missingInputs.length > 0) {
        const errorMessage = missingInputs.map(({ process, inputs }) => 
          `${process} is missing: ${inputs.join(', ')}`
        ).join('\n');
        
        setValidationError(errorMessage);
        return;
      }

      const selectedProcessList = Array.from(selectedProcesses);
      for (const processId of selectedProcessList) {
        const process = processes.find(p => p.id === processId);
        if (process) {
          const result = await executeProcess(process);
          setOutput(result);
        }
      }
    } catch (error) {
      console.error('Process execution error:', error);
      setOutput({
        status: 'error',
        content: 'An error occurred while executing the process. Please try again.',
        timestamp: new Date().toISOString()
      });
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