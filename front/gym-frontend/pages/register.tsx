import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function Register(){
    const[email, setEmail ] = useState('');
    const[password, setPassword ] = useState('');
    const[name, setName ] =useState('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            await axios.post('/api/auth/register', { name, email, password });
            toast.success('Registro exitoso');
            router.push('/login');
        }catch(err){
            toast.error('Error en el registro');
        }
    };

    return(
        <div className="flex justify-center items-center h-screen">
            <form className="bg-white p-6 rounded-lg shadow-lg" onSubmit={handleRegister}>
                <h2 className="text-2x1 mb-4">Registro</h2>
                <input className="border p-2 w-full mb-2" type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
                <input className="border p-2 w-full mb-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="border p-2 w-full mb-2" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="bg-blue-500 text-white p-2 w-full rounded">Registrarse</button>
            </form>
        </div>
    );

}