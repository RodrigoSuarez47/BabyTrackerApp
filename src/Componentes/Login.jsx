import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [mensajeError, setMensajeError] = useState('');
    const [botonDesactivado, setBotonDesactivado] = useState(true);

    useEffect(() => {
        if (usuario && password) {
            setBotonDesactivado(false);
        } else {
            setBotonDesactivado(true);
        }
    }, [usuario, password]);

    const formularioEnviado = (e) => {
        e.preventDefault();
        setBotonDesactivado(true);
        const datosLogin = {
            usuario,
            password
        };

        fetch('https://babytracker.develotion.com/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosLogin)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.mensaje || 'Error desconocido');
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.apiKey && data.id) {
                    // Guardar credenciales en localStorage
                    localStorage.setItem('token', data.apiKey);
                    localStorage.setItem('userId', data.id);
                    setBotonDesactivado(false);
                    navigate('/')
                } else {
                    throw new Error('Datos de login inválidos');
                }
            })
            .catch(err => {
                setMensajeError(`Error al iniciar sesión: ${err.message}`);
                setBotonDesactivado(false);
                navigate('/Login')
            });
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="card card-transparent my-5">
                        <form className="card-body p-lg-5" onSubmit={formularioEnviado}>
                            <h2 className="text-center text-gray">Iniciar Sesión</h2>
                            <div className="text-center">
                                <img
                                    src="https://img.freepik.com/foto-gratis/3d-portrait-of-adorable-cartoon-baby-boy_23-2151735024.jpg?t=st=1722748332~exp=1722748932~hmac=a36f3080999ac31b02913e29d53338eeec3f58d8d7cb7eee83efb81af82cd1f4"
                                    className="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                                    width="250px"
                                    alt="Avatar"
                                />
                            </div>
                            <div className="mb-3 d-flex flex-row align-items-center">
                                <img src="/img/usuario.svg" alt="Usuario" className="me-2" />
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username-login"
                                    aria-describedby="userHelp"
                                    placeholder="Usuario"
                                    value={usuario}
                                    onChange={(e) => setUsuario(e.target.value)}
                                    required
                                    aria-label="Nombre de usuario"
                                />
                            </div>
                            <div className="mb-3 d-flex flex-row align-items-center">
                                <img src="/img/contraseña.svg" alt="Contraseña" className="me-2" />
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password-login"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    aria-label="Contraseña"
                                />
                            </div>
                            {mensajeError && (
                                <div className="alert alert-danger text-center">
                                    {mensajeError}
                                </div>
                            )}
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary mb-3 px-5" disabled={botonDesactivado}>
                                    Ingresar
                                    <img src="/img/log-in.svg" alt="Login" className="ms-2" />
                                </button>
                            </div>
                            <div id="userHelp" className="form-text text-center text-dark">
                                <img src="/img/agregar-usuario.svg" alt="Agregar Usuario" className="me-2" />
                                No estás registrado?
                                <Link to="/Registro" className="text-dark fw-bold"> Crear una cuenta</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
