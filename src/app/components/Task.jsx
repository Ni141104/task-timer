'use client';
import { useState, useEffect } from 'react';

const Task = ({ task }) => {
    const [elapsedTime, setElapsedTime] = useState(task.elapsed || 0);
    const [isRunning, setIsRunning] = useState(task.isRunning);
    const [startTime, setStartTime] = useState(task.startTime);
    const [intervalId, setIntervalId] = useState(null);
    const [isCompleted, setIsCompleted] = useState(task.isCompleted || false);

    useEffect(() => {
        if (isRunning) {
            const id = setInterval(() => {
                const currentTime = new Date();
                const elapsedMilliseconds = currentTime - new Date(startTime);
                const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
                setElapsedTime(task.elapsed + elapsedSeconds);
            }, 1000);
            setIntervalId(id);
        } else if (intervalId) {
            clearInterval(intervalId);
        }
    
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isRunning]);
    

    const handleStartPause = async () => {
        const action = isRunning ? 'pause' : 'start';
        const updatedElapsedTime =  elapsedTime ; 

        const id = task._id;
        const res = await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, action, elapsedTime: updatedElapsedTime }),
        });

        if (res.ok) {
            const updatedTask = await res.json();
            console.log(updatedTask);
            task.elapsed=updatedTask.elapsed;
            setElapsedTime(updatedTask.elapsed);
            setStartTime(updatedTask.startTime );
           setIsRunning(updatedTask.isRunning);
        }
    };

    const handleComplete = async () => {
        const id = task._id;
        const res = await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, action: 'complete', elapsedTime: elapsedTime}), 
        });

        if (res.ok) {
            setIsCompleted(true); 
        }
    };

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center space-x-4">
            <div className="flex-1">
                <h3 className="text-lg font-semibold text-black">{task.name}</h3>
                <p className="text-gray-600">Elapsed Time: {elapsedTime} seconds</p>
            </div>
            <div className="flex space-x-2">
                {!isCompleted && (
                    <button
                        onClick={handleStartPause}
                        className={`px-4 py-2 rounded-md text-white ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                    >
                        {isRunning ? 'Pause' : 'Start'}
                    </button>
                )}
                <button
                    onClick={handleComplete}
                    className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                    disabled={isCompleted}
                >
                    {isCompleted ? 'Completed' : 'Mark as Completed'}
                </button>
            </div>
        </div>
    );
};

export default Task;
