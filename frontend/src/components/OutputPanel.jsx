import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function OutputPanel({ output }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-none h-16 px-6 flex items-center border-b border-gray-200 bg-white">
        <h2 className="text-xl font-bold text-gray-900">Output</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {output ? (
          <div className="space-y-4">
            <section>
              <h3 className="text-lg font-medium mb-3">Process Results</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="prose prose-sm max-w-none text-gray-600">
                  <ReactMarkdown>{output}</ReactMarkdown>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="text-gray-400">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500">Run a process to see the output here</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex-none h-16 px-6 flex items-center border-t border-gray-200 bg-white">
        <button
          className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm"
        >
          Install Output
        </button>
      </div>
    </div>
  );
}