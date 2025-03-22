interface CardProps{
    title:string;
    value:string;
}

export default function Card({ title, value }: CardProps){
    return(
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-2x1 font-bold">{value}</p>
        </div>
    );
}