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

    return <div className={`editor-section ${isEditorOpen ? 'open' : 'closed'}`}>
        <div className="section-header">
            <h2>Generator Function</h2>
            <button
                className="toggle-btn"
                onClick={() => setIsEditorOpen(!isEditorOpen)}
            >
                {isEditorOpen ? '-' : '+'}
            </button>
        </div>
        <div className="section-content">
            <MonacoEditor
                height="300px"
                defaultLanguage="typescript"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                }}
            />
        </div>
    </div>
}

export default GeneratorFunction;