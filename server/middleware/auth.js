import jwt from "jsonwebtoken";


export const protect = (req,res,next)=> {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({error:"Unauthorized"});
        }

        const token = authHeader.split(" ")[1]

        if(!token){
            return res.status(401).json({error:"Token not found"});
        }

        const session = jwt.verify(token, process.env.JWT_SECRET);

        if(!session){
            return res.status(401).json({error:"Unauthorized"})
        }   

        req.session = session;
        next(); 
    } catch (error) {
        console.log(error);
        return res.status(401).json({error:"Unauthorized"});
    }
}


export const protectAdmin = (req, res, next) => {
  
        if(req?.session?.role !== "ADMIN"){
            return res.status(403).json({error:"Forbidden"});
        }
        next();
    
}