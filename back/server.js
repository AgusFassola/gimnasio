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
        const{name, password} = req.body;
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
    }
});

app.listen(PORT, () =>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
} );