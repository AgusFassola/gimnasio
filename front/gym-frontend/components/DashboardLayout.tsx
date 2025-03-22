import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }){
    return(
        <div className="flex h-screen">
            <Sidebar/>
            <div className="flex-1 p-6">
                <Navbar/>
                {children}
            </div>
        </div>
    );
}