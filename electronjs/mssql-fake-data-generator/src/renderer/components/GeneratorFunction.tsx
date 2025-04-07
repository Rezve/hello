import { useState } from "react";
import MonacoEditor from '@monaco-editor/react';


const GeneratorFunction: React.FC = () => {

    const [isEditorOpen, setIsEditorOpen] = useState(true);

    const [code, setCode] = useState<string>(`
    import { faker } from '@faker-js/faker';
    import { User } from './types';
    
    const pastDates = Array.from({ length: 1000 }, () => faker.date.past());
    const recentDates = Array.from({ length: 1000 }, () => faker.date.recent());
    
    export function generateFakeUser(): User {
      return {
        Name: faker.person.fullName(),
        Email: faker.internet.email().toLowerCase(),
        Phone: faker.phone.number().toString(),
        Address: faker.location.streetAddress(),
        CreatedAt: pastDates[Math.floor(Math.random() * 1000)],
        UpdatedAt: recentDates[Math.floor(Math.random() * 1000)]
      };
    }
      `);

    return <div
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
      <div className="section-content p-4">
        <div className="editor-container bg-white border border-gray-300 rounded-md shadow-sm overflow-hidden">
          <MonacoEditor
            height="300px"
            defaultLanguage="typescript"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              fontFamily: "'Consolas', 'Courier New', monospace", // Windows-like monospaced font
              lineNumbers: "on", // Matches Windows dev tools
              renderLineHighlight: "all", // Highlights current line like VS Code on Windows
              padding: { top: 8, bottom: 8 }, // Adds spacing for a cleaner look
            }}
          />
        </div>
      </div>
    )}
  </div>
}

export default GeneratorFunction;