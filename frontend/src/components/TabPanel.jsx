import React, { useState } from 'react';
import { clsx } from 'clsx';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import FileUpload from './FileUpload';
import PromptEditor from './PromptEditor';
import OutputPanel from './OutputPanel';

export default function TabPanel({
  processes,
  activeTab,
  setActiveTab,
  selectedProcesses,
  onProcessSelect,
  processFiles,
  onFileUpload,
  processPrompts,
  onPromptUpdate,
  pipelineStatus,
  onRun,
  validationError,
  output
}) {
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [tempPrompt, setTempPrompt] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [activeSection, setActiveSection] = useState('description');
  const [outputs, setOutputs] = useState({});

  const handleProcessToggle = (processId) => {
    onProcessSelect(processId);
    setActiveTab(processId);
  };

  const handleEditPrompt = (processId) => {
    setEditingPrompt(processId);
    setTempPrompt(processPrompts[processId] || '');
  };

  const handleSavePrompt = (processId) => {
    onPromptUpdate(processId, tempPrompt);
    setEditingPrompt(null);
  };

  const handleRun = (processId, files) => {
    const output = `Output for ${processId}`;
    setOutputs((prevOutputs) => ({ ...prevOutputs, [processId]: output }));
    onRun(processId, files);
  };

  const tabs = [
    { id: 'pipeline', name: 'Pipeline' },
    ...processes.map(process => ({
      id: process.id,
      name: process.name
    }))
  ];

  const sections = [
    { id: 'description', name: 'Description' },
    { id: 'inputs', name: 'Required Inputs' },
    { id: 'configuration', name: 'Process Configuration' },
    { id: 'files', name: 'Files' },
    { id: 'prompt', name: 'Prompt' }
  ];

  const renderHelpContent = () => (
    <ul className="list-disc pl-5 text-blue-700 space-y-1">
      {activeTab === 'pipeline' ? (
        <>
          <li>Select processes using the checkboxes above</li>
          <li>Processes will execute in the order shown</li>
          <li>Ensure all required inputs are provided</li>
          <li>Click "Start Pipeline" when ready</li>
        </>
      ) : (
        <>
          <li>Navigate through sections using the tabs above</li>
          <li>Complete each section before running the process</li>
          <li>Required fields are marked with an asterisk (*)</li>
          <li>Click "Run Process" when ready</li>
        </>
      )}
    </ul>
  );

  return (
    <div className="flex flex-col h-full w-full">
      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex space-x-1 overflow-x-auto px-4">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={clsx(
                'relative group',
                activeTab === tab.id && 'bg-indigo-50 rounded-t-lg'
              )}
            >
              <div className="flex items-center px-3 py-2">
                {tab.id !== 'pipeline' && (
                  <input
                    type="checkbox"
                    checked={selectedProcesses.has(tab.id)}
                    onChange={() => handleProcessToggle(tab.id)}
                    className="h-4 w-4 text-indigo-600 rounded mr-2"
                  />
                )}
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'text-sm font-medium whitespace-nowrap transition-colors',
                    activeTab === tab.id
                      ? 'text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  {tab.name}
                </button>
              </div>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 flex flex-col min-h-0 border-r border-gray-200">
          {/* Header */}
          <div className="flex-none h-16 px-6 flex items-center justify-between border-b border-gray-200 bg-white">
            <h2 className="text-xl font-bold text-gray-900">
              {activeTab === 'pipeline' ? 'Pipeline Configuration' : processes.find(p => p.id === activeTab)?.name}
            </h2>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Show Help"
            >
              <QuestionMarkCircleIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Section Tabs */}
          {activeTab !== 'pipeline' && (
            <div className="flex-none border-b border-gray-200 bg-white">
              <div className="px-6 py-2 flex flex-wrap gap-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={clsx(
                      'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      activeSection === section.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    {section.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {showHelp && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-blue-800 mb-2">
                  {activeTab === 'pipeline' ? 'Pipeline Guide' : 'Process Guide'}
                </h3>
                {renderHelpContent()}
              </div>
            )}

            {activeTab === 'pipeline' ? (
              <div className="space-y-4">
                {processes
                  .filter(p => selectedProcesses.has(p.id))
                  .map((process, index) => (
                    <div key={process.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">{index + 1}.</span>
                          <h3 className="font-medium">{process.name}</h3>
                        </div>
                        <span className={clsx(
                          'text-sm px-2 py-1 rounded-full',
                          pipelineStatus[process.id] === 'completed' ? 'bg-green-100 text-green-800' :
                          pipelineStatus[process.id] === 'running' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        )}>
                          {pipelineStatus[process.id] || 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}

                {validationError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                    <h4 className="text-red-700 font-medium mb-2">Missing Required Inputs:</h4>
                    <pre className="text-red-600 text-sm whitespace-pre-wrap">{validationError}</pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {processes
                  .filter(process => process.id === activeTab)
                  .map(process => {
                    const sectionContent = {
                      description: (
                        <div key="description" className="bg-gray-50 rounded-lg p-4">
                          <div className="space-y-2 text-gray-600">
                            {process.details.map((detail, index) => (
                              <p key={`detail-${index}`}>{detail}</p>
                            ))}
                          </div>
                        </div>
                      ),
                      inputs: (
                        <div key="inputs" className="bg-gray-50 rounded-lg p-4">
                          <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            {process.inputs.map((input, index) => (
                              <li key={`input-${index}`}>{input}</li>
                            ))}
                          </ul>
                        </div>
                      ),
                      configuration: (
                        <div key="configuration" className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-600">Configure settings for {process.name}</p>
                        </div>
                      ),
                      files: (
                        <FileUpload
                          key="files"
                          processId={process.id}
                          onFilesSelected={onFileUpload}
                          existingFiles={processFiles[process.id]}
                          allowMultiple={true}
                        />
                      ),
                      prompt: (
                        <div key="prompt">
                          {editingPrompt === process.id ? (
                            <div className="space-y-3">
                              <PromptEditor
                                value={tempPrompt}
                                onChange={setTempPrompt}
                                placeholder={`Customize prompt for ${process.name}...`}
                              />
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleSavePrompt(process.id)}
                                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingPrompt(null)}
                                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-600">
                                  {processPrompts[process.id] || process.defaultPrompt || 'No prompt set'}
                                </p>
                              </div>
                              <button
                                onClick={() => handleEditPrompt(process.id)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    };

                    return sectionContent[activeSection];
                  })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex-none h-16 px-6 flex items-center border-t border-gray-200 bg-white">
            <button
              onClick={() => {
                if (activeTab !== 'pipeline') {
                  const foundProcess = processes.find(p => p.id === activeTab);
                  const hasFiles = processFiles[activeTab]?.length > 0;
                  
                  if (!hasFiles) {
                    window.alert('Please upload files before running the process');
                    return;
                  }
                  
                  if (foundProcess) {
                    window.alert(`${foundProcess.name} is started`);
                    handleRun(foundProcess.id, processFiles[activeTab]);
                  }
                } else {
                  onRun();
                }
              }}
              disabled={activeTab === 'pipeline' ? selectedProcesses.size === 0 : !processFiles[activeTab]?.length}
              className={clsx(
                "w-full py-2 px-4 rounded-md text-white transition-colors shadow-sm",
                !processFiles[activeTab]?.length ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              )}
            >
              {activeTab === 'pipeline' ? 'Start Pipeline' : 'Run Process'}
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 flex flex-col min-h-0">
          <OutputPanel output={outputs[activeTab]} />
        </div>
      </div>
    </div>
  );
}