import Link from "next/link";

export default function Sidebar(){
    return(
        <aside className="bg-gray-800 text-white w-64 h-screen p-5">
            <ul>
                <li className="mb-4"><Link href="/dashboard">Dashboard</Link></li>
                <li className="mb-4"><Link href="/users">Usuarios</Link></li>
                <li className="mb-4"><Link href="/memberships">Membresías</Link></li>
            </ul>
        </aside>
    );
}