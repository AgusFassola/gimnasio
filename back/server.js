require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

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

//importar rutas
const userRotes = require('./routes/userRoutes');
const membershipRoutes = require('./routes/membershipRoutes');

app.use('./api/users', userRotes);
app.use('./api/memberships', membershipRoutes);

app.listen(PORT, () =>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
} );




