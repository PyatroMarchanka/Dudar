import React, { useState, useEffect } from 'react';

const Logger: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        const handleLog = (event: CustomEvent) => {
            setLogs((prevLogs) => [...prevLogs, event.detail]);
        };

        window.addEventListener('log', handleLog as EventListener);

        return () => {
            window.removeEventListener('log', handleLog as EventListener);
        };
    }, []);

    return (
        <div style={styles.container}>
            {logs.map((log, index) => (
                <div key={index} style={styles.log}>
                    {log}
                </div>
            ))}
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed' as 'fixed',
        bottom: 0,
        right: 0,
        width: '300px',
        maxHeight: '200px',
        overflowY: 'auto' as 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 1000,
    },
    log: {
        marginBottom: '5px',
    },
};

export default Logger;

// Usage example:
// To log a message, you can dispatch a custom event like this:
// window.dispatchEvent(new CustomEvent('log', { detail: 'This is a log message' }));