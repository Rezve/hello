import { useEffect, useRef, useState } from "react";

interface StatusbarProps {
    status: string
}

const StatusBar: React.FC = () => {

    const [status, setStatus] = useState('Ready');

    useEffect(() => {
        const handleProgress = (status: any) => {
            setStatus(status);
        };
        window.electronAPI.on('app:status', handleProgress);
    }, []);

    return (
    <div className="p-2 bg-gray-200 border-t border-gray-300 text-sm text-gray-600">
        Status: {status ? status: 'Ready'}
    </div>
    )
}

export default StatusBar;