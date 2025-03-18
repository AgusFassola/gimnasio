const express = require('express');
const router = express.Router();
const Membership = require('../models/Membership');
const { autenticateToken, autorizarRole } = require('../middleware/authMiddleware');


//ruta solo para admin - nueva membresia
router.post('/', autenticateToken, autorizarRole(['admin']), async (req,res) => {
    try{
        const { name, duration, price, benefits } = req.body;
        const newMembership = new Membership({ name, duration, price, benefits });
        await newMembership.save();
        res.status(201).json(newMembership);
    }catch(err){
        res.status(500).json({ message:'Error al crear membresia.' });
    }
});

//obtener membresias
router.get('/', async (req, res) => {
    try{
        const membresias = await Membership.find();
        if(!membresias) return res.status(404).json({ message:'Membresia no encontrada.' });
        res.json(membresias);
    }catch(err){
        res.status(500).json({ message:'Error al obtener membresía.' });
    }
});

//actualizar la membresia
router.put('/:id', autenticateToken, autorizarRole(['admin']), async (req,res) => {
    try{
        const { name, duration, price, benefits } = req.body;
        const updateMembresia = await Membership.findByIdAndUpdate(req.params.id,{ name, duration, price, benefits }, {new:true});
        if(!updateMembresia) return res.status(404).json({ message:'Membresía no encontrada para editar.' });
        res.json(updateMembresia);
    }catch(err){
        res.status(500).json({ message:'Error en el servidor actualizar.' });
    }
});

//eliminar un usuario(solo admin)
router.delete('/:id', autenticateToken, autorizarRole(['admin']), async (req, res) => {
    try{
        const deleteMembresia = await Membership.findByIdAndDelete(req.params.id);
        if(!deleteMembresia) return res.status(404).json({ message:'Membresia no encontrada.' });
        res.json({ message:'Eliminada con éxito.' });
    }catch(err){
        res.status(500).json({ message:'Error en el servidor de eliminar.' });
    }
});

module.exports = router;
