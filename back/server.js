require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json());

//conectar a MongoDB
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
}).then(() => console.log('MongoDB conectado'))
.catch(err => console.log(err));

//Modelo de usuario
const userSchema = new mongoose.Schema({
    name:{ type: String, required:true },
    email:{ type: String, required:true, unique:true },
    password:{ type: String, required:true },
    role:{ type: String, enum:['admin','trainer','client'], default:'client' }
});
const User = mongoose.model('User', userSchema);


//middleware de autenticacion
const autenticateToken = (req, res, next) =>{
    const token = req.header('Authorization');
    if(!token) return res.status(401).json({ message:'No tiene autorizacion' });

    try{
        const verified = jwt.verify(token.replace('Bearer ',''), process.env.JWT_SECRET);
        req.user = verified;
        next();
    }catch(err){
        res.status(403).json({ message:'Token inválido' });
        console.log("error de token:", err);
    }
};

//Middleware de autorizacion por rol
const autorizarRole = (roles) =>{
    return(req, res, next) =>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({ message:'Acceso no autorizado' });
        }
        next();
    };
};

//Registrar un usuario
app.post('/api/register', async (req, res) => {

    try{
        const{name, email, password, role} = req.body;
        const existeUser = await User.findOne({email});
        if(existeUser) return res.status(400).json({message:'El usuario ya existe'});

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({name, email, password:hashedPassword, role});
        await newUser.save();

        res.status(201).json({ message:'Usuario registrado con éxito' });
    }catch(error){
        res.status(500).json({ message:'Error al crear usuario, $(error)' });
        console.log("error al crear:",error);
    }
});

//Registrar un usuario
app.post('/api/login', async (req, res) => {

    try{
        const{email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message:'El usuario no existe'});

        const coinciden = await bcrypt.compare(password, user.password);
        if(!coinciden) return res.status(400).json({ message:'Contraseña incorrecta' });

        const token = jwt.sign(
            { 
                id:user._id, 
                role: user.role 
            }, 
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );

        res.json({ token, user:{id:user._id, name: user.name, email:user.email, role:user.role} });

    }catch(error){
        res.status(500).json({ message:'Error al iniciar sesion' });
        console.log("error al iniciar sesion:",error);

    }
});

//ruta solo para admin
app.get('/api/users', autenticateToken, autorizarRole(['admin']), async (req,res) => {
    try{
        const users = await User.find();
        res.json(users);
    }catch(err){
        res.status(500).json({ message:'Error al obtener usuarios' });
    }
});

//obtener usuario por id
app.get('/api/users/:id', autenticateToken, async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({ message:'Usuario no encontrado' });
        res.json(user);
    }catch(err){
        res.status(500).json({ message:'Error al traer el usuario' });
    }
});

//actualizar el usuario
app.put('/api/users/:id', autenticateToken, async (req,res) => {
    try{
        const { name,email,role } = req.body;
        const updateUser = await User.findByIdAndUpdate(req.params.id,{ name,email,role }, {new:true});
        console.log("Error llegué acá:");
        if(!updateUser) return res.status(404).json({ message:'Usuario no encontrado para editar' });
        console.log("ahora Error llegué acá:");
        res.json(updateUser);
    }catch(err){
        res.status(500).json({ message:'Error en el servidor actualizar' });
        console.log("Error acá:", err);
    }
});

//eliminar un usuario(solo admin)
app.delete('/api/users/:id', autenticateToken, autorizarRole(['admin']), async (req, res) => {
    try{
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        if(!deleteUser) return res.status(404).json({ message:'Usuario no encontrado' });
        res.json({ message:'Eliminado con éxito' });
    }catch(err){
        res.status(500).json({ message:'Error en el servidor de eliminar' });
    }
});

//ruta solo para admin
app.get('/api/admin', autenticateToken, autorizarRole(['admin']), (req,res)=>{
    res.json({ message:'Bienvenido admin' });
});

app.listen(PORT, () =>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
} );