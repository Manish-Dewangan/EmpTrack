import Employee from "../models/Employee.js"
import Payslip from "../models/Payslip.js";

//Create payslip
// POST /api/payslips
export const createPayslip = async (req, res)=>{
    try {
        const {employeeId, month, year, basicSalary, allowances, deductions} = req.body;

        if(!employeeId || !month || !year || !basicSalary){
            return res.status(400).json({message:"Missing required fields"})
        }

        const netSalary = Number(basicSalary) + Number(allowances || 0) - Number(deductions || 0);

        const payslip = await Payslip.create({
            employeeId,
            month : Number(month),
            year : Number(year),
            basicSalary : Number(basicSalary),
            allowances : Number(allowances || 0),
            deductions : Number(deductions || 0),
            netSalary : Number(netSalary)
        })

        res.status(201).json({success:true, payslip})

    } catch (error) {
        res.status(500).json({message: "Failed to create payslip", error: error.message})
    }
}


// Get payslip
// Get /api/payslips
export const getPayslips = async (req, res)=>{
    try {
        const session = req.session
        const isAdmin = session.role === "ADMIN"
        if(isAdmin){
            const payslips = await Payslip.find().populate("employeeId").sort({createdAt : -1}).lean()
            const data = payslips.map((obj)=>{
                return {
                    ...obj,
                    id: obj._id.toString(),
                    employee: obj.employeeId,
                    employeeId : obj.employeeId?._id?.toString()
                }
            })

            return res.json({data})
        }
        else{
            const employee = await Employee.findOne({userId: session.userId})

            if(!employee) return res.status(404).json({error: "Not found"});

            const payslips = await Payslip.find({employeeId: employee._id}).sort({createdAt : -1})

            return res.json({data: payslips})
        }
    } catch (error) {
        res.status(500).json({message: "Failed to get payslips", error: error.message})
    }
}


//Create payslip by ID
// GET /api/payslips/:id
export const getPayslipById = async (req, res)=>{
try {
    const payslip = await Payslip.findById(req.params.id).populate("employeeId").lean()

    if(!payslip){
        return res.status(404).json({error: "Not found"})
    }

    const result = {
        ...payslip,
        id: payslip._id.toString(),
        employee: payslip.employeeId,
        employeeId: payslip.employeeId?._id?.toString()
    }

    return res.json(result)

} catch (error) {
    res.status(500).json({message: "Failed to get payslip", error: error.message})
}
}