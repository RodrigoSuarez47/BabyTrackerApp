import { useNavigate } from "react-router-dom";
const Logout = () => {
    const navigate = useNavigate();

    const cerrarSesion = () => {
        localStorage.clear();
        navigate('/Login');
    };

    return (
        <div className="logout-container">
            <button className="btn btn-danger" onClick={cerrarSesion}>
                Cerrar Sesión
                <img src="/img/log-out.svg" alt="LogOut" className='mx-2' />
            </button>
        </div>
    )
}

export default Logout;
