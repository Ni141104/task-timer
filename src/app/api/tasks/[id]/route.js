import Task from "@/app/models/task";
import { connectToDB } from "@/app/utils/database";

export const PUT = async (req) => {
    const { id, action, elapsedTime } = await req.json();  // Added elapsedTime
    try {
        await connectToDB();
        const task = await Task.findById(id);
        if (!task) {
            return new Response(JSON.stringify({ message: 'Task does not exist' }), { status: 400 });
        }

        const currentTime = new Date();

        if (action === 'start' && !task.isRunning) {
            task.isRunning = true;
            task.startTime = currentTime;
        } else if (action === 'pause' && task.isRunning) {
            // When pausing, update elapsed time properly
            task.elapsed += elapsedTime || (currentTime - task.startTime);  // Use elapsedTime passed from the frontend
            task.isRunning = false;
            // Don't set startTime to null, keep the last startTime for accurate resume
        } else if (action === 'complete') {
            if (task.isRunning) {
                task.elapsed += currentTime - task.startTime;
            }
            task.isRunning = false;
            task.isCompleted = true;
            task.startTime = null;  // Clear startTime only when completing
        }

        await task.save();
        return new Response(JSON.stringify(task), { status: 200 });  // Return updated task
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), { status: 405 });
    }
};
