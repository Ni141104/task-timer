import Task from "@/app/models/task";
import { connectToDB } from "@/app/utils/database";

export const POST = async (req) => {
    const { name } = await req.json();
    try {
        await connectToDB();
        const newTask = new Task({ name });
        await newTask.save();
        return new Response(JSON.stringify(newTask), { status: 200 });  // Return the task object
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
};

export const GET = async (req) => {
    try {
        await connectToDB();
        const tasks = await Task.find();
        return new Response(JSON.stringify({ totalTasks: tasks }), { status: 200 });  // Return all tasks
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), { status: 402 });
    }
};
