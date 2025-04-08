import { useEffect, useState } from "react";
import MonacoEditor from '@monaco-editor/react';
import { AdvancedCode, BasicCode } from "../utils/sample-code";

interface GeneratorFunctionProps {
  isConnected: boolean;
  isCodeConfirmed: boolean;
  setCodeConfirmed: (flag: boolean) => void;
}

const GeneratorFunction: React.FC<GeneratorFunctionProps> = ({ isConnected, isCodeConfirmed, setCodeConfirmed }) => {
  const [isEditorOpen, setIsEditorOpen] = useState(true);
  const [sampleData, setSampleData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdvanceCodeLoaded, setAdvanceCodeLoaded] = useState(false);
  const [code, setCode] = useState<string>(BasicCode);
  const [hasCodeChanged, setHasCodeChanged] = useState(false);
  const [confirmButtonText, setConfirmButtonText] = useState('Run & Validate');
  const [error, setError] = useState(null);

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

  const handleCodeConfirmation = () => {
    setCodeConfirmed(true);
    setIsModalOpen(false);
    setSampleData(null);
    setConfirmButtonText('Confirmed')
    setHasCodeChanged(false);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setSampleData(null);
  };

  return (
    <div
      className={`editor-section ${
        isEditorOpen ? "open" : "closed"
      } bg-white border border-gray-300 rounded-md shadow-sm relative`}
    >
      {/* Overlay if not connected */}
      {!isConnected && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center z-10">
        <div className="bg-white px-4 py-2 rounded-md shadow-sm border border-gray-300">
          <p className="text-gray-600 text-sm font-medium">
            Please connect to the database first.
          </p>
        </div>
      </div>
      )}

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
              height="42vh"
              defaultLanguage="javascript"
              value={code}
              onChange={(value) => { 
                setCode(value || "")
                if (isCodeConfirmed && !hasCodeChanged) {
                  setConfirmButtonText('Re-run & Validate');
                  setHasCodeChanged(true);
                }
              }}
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
              className={`px-4 py-2 bg-blue-600 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${isCodeConfirmed && !hasCodeChanged ? 'bg-gray-600 hover:bg-gray-700': 'bg-blue-600 hover:bg-blue-700'}`}
              onClick={handleRunCode}
            >
              {confirmButtonText}
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">Review Generated Data</h3>
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
            <button
              className="mt-4 ml-5 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
              onClick={handleCodeConfirmation}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GeneratorFunction;