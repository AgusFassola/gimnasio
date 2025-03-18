const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { autenticateToken, autorizarRole } = require('../middleware/authMiddleware');

//Registrar un usuario
router.post('/register', async (req, res) => {

    try{
        const{name, email, password, role} = req.body;
        const existeUser = await User.findOne({email});
        if(existeUser) return res.status(400).json({message:'El usuario ya existe'});

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({name, email, password:hashedPassword, role});
        await newUser.save();

        res.status(201).json({ message:'Usuario registrado con éxito' });
    }catch(error){
        res.status(500).json({ message:'Error al crear usuario.' });
    }
});

//loguear un usuario
router.post('/login', async (req, res) => {

    try{
        const{email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message:'El usuario no existe.'});

        const coinciden = await bcrypt.compare(password, user.password);
        if(!coinciden) return res.status(400).json({ message:'Contraseña incorrecta.' });

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
        res.status(500).json({ message:'Error al iniciar sesion.' });
    }
});

//ruta solo para admin
router.get('/', autenticateToken, autorizarRole(['admin']), async (req,res) => {
    try{
        const users = await User.find();
        res.json(users);
    }catch(err){
        res.status(500).json({ message:'Error al obtener usuarios' });
    }
});

//obtener usuario por id
router.get('/:id', autenticateToken, async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({ message:'Usuario no encontrado.' });
        res.json(user);
    }catch(err){
        res.status(500).json({ message:'Error al traer el usuario.' });
    }
});

//actualizar usuario
router.put('/:id', autenticateToken, autorizarRole(['admin']), async (req,res) => {
    try{
        const{name, email, role} = req.body;
        const updateUser = await User.findByIdAndUpdate(req.params.id,{ name, email, role }, {new:true});
        if(!updateUser) return res.status(404).json({ message:'Usuario no encontrado para editar.' });
        res.json(updateUser);
    }catch(err){
        res.status(500).json({ message:'Error en el servidor actualizar.' });
    }
});


//eliminar un usuario(solo admin)
router.delete('/:id', autenticateToken, autorizarRole(['admin']), async (req, res) => {
    try{
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        if(!deleteUser) return res.status(404).json({ message:'Usuario no encontrado.' });
        res.json({ message:'Eliminado con éxito.' });
    }catch(err){
        res.status(500).json({ message:'Error en el servidor de eliminar.' });
    }
});


//actualizar membresia
router.put('/:id/membership', autenticateToken, autorizarRole(['admin']), async (req,res) => {
    try{
        const { membershipId } = req.body;
        const updateUser = await User.findByIdAndUpdate(req.params.id,{ membership: membershipId }, {new:true}).populate('membership');
        if(!updateUser) return res.status(404).json({ message:'Usuario no encontrado para editar.' });
        res.json(updateUser);
    }catch(err){
        res.status(500).json({ message:'Error en el servidor actualizar.' });
    }
});


//ruta solo para admin
router.get('/admin', autenticateToken, autorizarRole(['admin']), (req,res)=>{
    res.json({ message:'Bienvenido admin.' });
});

module.exports = router;
