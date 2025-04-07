import { useEffect, useState } from "react";
import MonacoEditor from '@monaco-editor/react';
import { AdvancedCode, BasicCode } from "../utils/sample-code";

const GeneratorFunction: React.FC = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(true);
  const [sampleData, setSampleData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdvanceCodeLoaded, setAdvanceCodeLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [code, setCode] = useState<string>(BasicCode);

  useEffect(() => {
    window.electronAPI.on("app:code:result", (result) => {
      if (result.error) {
        setError(result.error);
      } else {
        setSampleData(result[0]);
        setIsModalOpen(true);
      }
    });
  }, []);

  const handleRunCode = () => {
    setError(null);
    window.electronAPI.send("app:code", code);
  };

  const handleLoadAdvanced = () => {
    setCode(isAdvanceCodeLoaded ? BasicCode: AdvancedCode);
    setError(null);
    setAdvanceCodeLoaded(!isAdvanceCodeLoaded)
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setSampleData(null);
  };

  return (
    <div
      className={`editor-section ${
        isEditorOpen ? "open" : "closed"
      } bg-white border border-gray-300 rounded-md shadow-sm`}
    >
      {/* Section Header */}
      <div className="section-header flex items-center justify-between p-2 bg-gray-200 border-b border-gray-300">
        <h2 className="text-sm font-semibold text-gray-800">Generator Function</h2>
        <button
          className="toggle-btn w-6 h-6 flex items-center justify-center text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors duration-200"
          onClick={() => setIsEditorOpen(!isEditorOpen)}
        >
          {isEditorOpen ? "-" : "+"}
        </button>
      </div>

      {/* Section Content (Visible when open) */}
      {isEditorOpen && (
        <div className="section-content p-4 flex flex-col gap-4">
          <div className="editor-container bg-white border border-gray-300 rounded-md shadow-sm overflow-hidden">
            <MonacoEditor
              height="52vh"
              defaultLanguage="javascript"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                fontFamily: "'Consolas', 'Courier New', monospace",
                lineNumbers: "on",
                renderLineHighlight: "all",
                padding: { top: 8, bottom: 8 },
              }}
            />
          </div>

          {/* Buttons and Error Display */}
          <div className="flex items-center justify-between">
            {/* Run/Validate Button */}
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={handleRunCode}
            >
              Test Code
            </button>

            {/* Load Advanced Example Button */}
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={handleLoadAdvanced}
            >
              { isAdvanceCodeLoaded ? 'Load Basic Example': 'Load Advanced Example'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm">
              Error: {error}
            </div>
          )}
        </div>
      )}

      {/* Modal for Sample Data */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">Preview Generated Data</h3>
            {sampleData && (
              <table className="w-full border-collapse border border-gray-300">
                <tbody>
                  {Object.entries(sampleData).map(([key, value]) => (
                    <tr key={key} className="border-b border-gray-300">
                      <td className="p-2 font-semibold border-r border-gray-300">{key}</td>
                      <td className="p-2">
                        {value instanceof Date ? value.toISOString() : String(value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GeneratorFunction;