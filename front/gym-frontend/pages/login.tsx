import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function Login(){
    const [email, setEmail] = useState('.');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            const res = await axios.post('/api/auth/login', { email, password });
            toast.success('Inicio de sesion exitoso.');
            router.push('/dashboard');
        }catch(err){
            toast.error('Error en las credenciales');
        }
    };

    return(
        <div className='flex justify-center items-center h-screen'>
            <form className='gb-white p-6 rounded-lg shadow-lg' onSubmit={handleLogin}>
                <h2 className='text-2x1 mb-4'>Iniciar Sesión</h2>
                <input className='border p-2 w-full mb-2' type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className='border p-2 w-full mb-2' type='password' placeholder='Contraseña' value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className='bg-blue-500 text-white p-2 w-full rounded' >Ingresar</button>
            </form>
        </div>
    );
}