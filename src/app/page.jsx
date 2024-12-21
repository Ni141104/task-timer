import TaskList from "./components/TaskList";   // Import the TaskList component

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Welcome to Task Timer</h1>
            <p className="text-xl text-gray-600 mb-8">Manage your tasks and track time easily</p>
            
            <TaskList />
        </div>
    );
}
