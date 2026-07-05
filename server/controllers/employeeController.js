import bcrypt from "bcrypt";
import Employee from "../models/Employee.js";
import User from "../models/User.js";


//Get employees
//GET /api/employees

export const getEmployees = async(req, res)=> {
try {
    const {department} = req.query;
    const where = {};

    if(department) where.department = department;

    const employees = await Employee.find(where).sort({createdAt:-1}).populate("userId", "email role").lean();

    const result = employees.map((emp)=>({
        ...emp,
        id: emp._id.toString(),
        user: emp.userId ? {email: emp.userId.email, role:emp.userId.role} : null,
        
    }))

    res.json(result);

} catch (error) {
    return res.status(500).json({message: "Error fetching employees"});
}
}

//Create employee
//POST /api/employees

export const createEmployee = async(req, res)=> {
    try {
        const {firstName, lastName, email, phone, position, basicSalary, allowances, deductions, joinDate, password, department,role, bio} = req.body;
        
        if(!email || !password || !firstName || !lastName){
            return res.status(400).json({error: "Missing required fields"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            password: hashedPassword,
            role: role || "EMPLOYEE"
        });

        const employee = await Employee.create({
            userId: user._id,
            firstName,
            lastName,
            email,
            phone,
            position,
            department : department || "Engineering",
            basicSalary : Number(basicSalary) || 0,
            allowances : Number(allowances) || 0,
            deductions : Number(deductions) || 0,
            joinDate : new Date(joinDate),
            bio : bio || ""
        });

        res.status(201).json({success: true, employee});

    } catch (error) {
       if(error.code === 11000){
        return res.status(400).json({error: "Email already exists"});
       }

       console.error("Create employee error:",error);
       res.status(500).json({error: "Failed to create employee"});
    }
}


//Update employee
//PUT /api/employees/:id

export const updateEmployee = async(req, res)=> {
    try {
        const {id} = req.params;
        const {firstName, lastName, email, phone, position, basicSalary, allowances, deductions,  department, role, bio, employmentStatus, password} = req.body;

        const employee = await Employee.findById(id);
        if(!employee){
            return res.status(404).json({message:"Employee not found"})
        }

        await Employee.findByIdAndUpdate(id,{
            firstName,
            lastName,
            email,
            phone,
            position,
            department : department || "Engineering",
            basicSalary : Number(basicSalary) || 0,
            allowances : Number(allowances) || 0,
            deductions : Number(deductions) || 0,
            bio : bio || "",
            employmentStatus : employmentStatus || "ACTIVE"
        });

        //Update user record
        const userUpdate = {email}

        if(role) userUpdate.role = role;
        if(password) userUpdate.password = await bcrypt.hash(password, 10);

        await User.findByIdAndUpdate(employee.userId, userUpdate)

        return res.json({success: true})
        
    } catch (error) {
        if(error.code === 11000){
        return res.status(400).json({error: "Email already exists"});
       }

       res.status(500).json({error: "Failed to update employee"});
    }
}


//Delete employee
//DELETE /api/employees/:id

export const deleteEmployee = async(req, res)=> {
    try {
        const {id} = req.params;

        const employee = await Employee.findById(id)
        if(!employee) return res.status(400).json({error:"Employee not found"});

        employee.isDeleted = true;
        employee.employmentStatus = "INACTIVE"
        await employee.save()
        return res.json({success : true});
    } catch (error) {
        res.status(500).json({error: "Failed to delete employee"});
    }
}