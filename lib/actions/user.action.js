'use server'

import Recruiter from "@/models/Recruiter"
import connectDB from "../dbConnect"

export async function createUser(user) {
    try {
        await connectDB()
        const newUser = await Recruiter.create(user)
        return JSON.parse(JSON.stringify(newUser))

    } catch (error) {
        console.log(error);

    }
}