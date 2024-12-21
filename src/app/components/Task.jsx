'use client';
import { useState, useEffect } from 'react';

const Task = ({ task, onComplete }) => {
    const [elapsedTime, setElapsedTime] = useState(task.elapsed || 0);
    const [isRunning, setIsRunning] = useState(task.isRunning || false);
    const [startTime, setStartTime] = useState(task.startTime || null);
    const [intervalId, setIntervalId] = useState(null);

    // Update the elapsed time every second
    useEffect(() => {
        if (isRunning) {
            const id = setInterval(() => {
                setElapsedTime(prev => prev + 1); // Increment elapsed time
            }, 1000);
            setIntervalId(id);
        } else if (intervalId) {
            clearInterval(intervalId); // Clear interval on pause
        }

        return () => {
            if (intervalId) clearInterval(intervalId); // Clean up on unmount
        };
    }, [isRunning]);

    const handleStartPause = async () => {
        const action = isRunning ? 'pause' : 'start';
        const currentTime = new Date();

        // If starting, set the start time
        const updatedElapsedTime = isRunning ? elapsedTime : 0;
        const id = task._id;
        const res = await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, action, elapsedTime: updatedElapsedTime }),
        });

        if (res.ok) {
            const updatedTask = await res.json();
            setStartTime(updatedTask.startTime || currentTime);
            setIsRunning(updatedTask.isRunning);
        }
    };

    const handleComplete = async () => {
        const id = task._id;
        const res = await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, action: 'complete', elapsedTime }),
        });

        if (res.ok) {
            // After completing the task, call onComplete to remove it from the UI
            onComplete(id);
        }
    };

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center space-x-4">
            <div className="flex-1">
                <h3 className="text-lg font-semibold text-black">{task.name}</h3>
                <p className="text-gray-600">Elapsed Time: {elapsedTime} seconds</p>
            </div>
            <div className="flex space-x-2">
                <button
                    onClick={handleStartPause}
                    className={`px-4 py-2 rounded-md text-white ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                >
                    {isRunning ? 'Pause' : 'Start'}
                </button>
                <button
                    onClick={handleComplete}
                    className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                >
                    Complete
                </button>
            </div>
        </div>
    );
};

export default Task;
