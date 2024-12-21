import Task from "@/app/models/task";
import { connectToDB } from "@/app/utils/database";

export const PUT = async (req) => {
    const { id, action, elapsedTime } = await req.json();
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
            task.elapsed += elapsedTime || (currentTime - task.startTime); 
            task.isRunning = false;
        } else if (action === 'complete') {
            if (task.isRunning) {
                task.elapsed += currentTime - task.startTime;
            }
            task.isRunning = false;
            task.isCompleted = true;
            task.startTime = null; 
        }

        await task.save();
        return new Response(JSON.stringify(task), { status: 200 });  
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), { status: 405 });
    }
};
