'use client'
import { useEffect, useState } from 'react';
import Task from './Task'; 

const TaskList = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch('/api/tasks');
                const data = await res.json();
                if (res.ok) {
                    setTasks(data.totalTasks);
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, []); 

    const handleAddTask = async (name) => {
        const res = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });

        if (res.ok) {
            const newTask = await res.json();
            setTasks((prevTasks) => [...prevTasks, newTask]);
        }
    };

    const handleCompleteTask = (taskId) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-2xl font-semibold text-center mb-4 text-black">Task Timer</h2>
            <div className="mb-6 flex justify-between items-center">
                <input
                    type="text"
                    id="taskName"
                    placeholder="Enter task name"
                    className="border text-black border-gray-300 rounded-md px-4 py-2 w-2/3"
                />
                <button
                    onClick={() => handleAddTask(document.getElementById('taskName').value)}
                    className="ml-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Add Task
                </button>
            </div>
            <div className="space-y-4">
                {tasks.map((task) => (
                    <Task key={task._id} task={task} onComplete={handleCompleteTask} />
                ))}
            </div>
        </div>
    );
};

export default TaskList;
