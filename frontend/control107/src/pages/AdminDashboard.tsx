import { Navigate } from "react-router-dom";

//Placeholder - solamente redirige a categorias al momento. 
export default function AdminDashboard() {
    return (
        <Navigate
            to="/categorias"
            replace
        />
    );
}