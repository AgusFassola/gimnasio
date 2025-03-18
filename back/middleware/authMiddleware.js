//middleware de autenticacion

const jwt= require('jsonwebtoken');

const autenticateToken = (req, res, next) =>{
    const token = req.header('Authorization');
    if(!token) return res.status(401).json({ message:'No tiene autorizacion' });

    try{
        const verified = jwt.verify(token.replace('Bearer ',''), process.env.JWT_SECRET);
        req.user = verified;
        next();
    }catch(err){
        res.status(403).json({ message:'Token inválido' });
    }
};

//autorizacion por rol
const autorizarRole = (roles) =>{
    return(req, res, next) =>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({ message:'Acceso no autorizado' });
        }
        next();
    };
};

module.exports = { autenticateToken, autorizarRole };
