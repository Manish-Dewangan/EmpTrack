import "dotenv/config";
import connectDB from "./config/db.js";
import LeaveApplication from "./models/LeaveApplication.js";
import Employee from "./models/Employee.js";

async function test() {
    await connectDB();
    const leaves = await LeaveApplication.find().populate("employeeId").sort({createdAt:-1});
    const data = leaves.map((l)=>{
        const obj = l.toObject();
        return {
            ...obj,
            id: obj._id.toString(),
            employee: obj.employeeId,
            employeeId:obj.employeeId?._id?.toString(),
        }
    })
    console.log(JSON.stringify(data[0], null, 2));
    process.exit(0);
}

test();
