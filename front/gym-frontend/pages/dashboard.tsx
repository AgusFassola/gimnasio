import DashboardLayout from '@/components/DashboardLayout';
import Card from '@/components/Card';

export default function Dashboard(){
    return(
        <DashboardLayout>
            <h1 className='text-3x1 font-bold mb-6'>Dashboard</h1>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <Card title="Usuarios" value="150" />
                <Card title="Membresias Activas" value="120" />
                <Card title="Ingresos Mensuales" value="$5000" />
            </div>
        </DashboardLayout>
    );
}