import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Registro = () => {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [idDepartamento, setIdDepartamento] = useState('');
    const [idCiudad, setIdCiudad] = useState('');
    const [listaDepartamentos, setListaDepartamentos] = useState([]);
    const [listaCiudades, setListaCiudades] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener departamentos
        fetch('https://babytracker.develotion.com/departamentos.php')
            .then(response => response.json())
            .then(data => {
                setListaDepartamentos(data.departamentos);
            })
            .catch(error => {
                setErrorMessage('Error al cargar departamentos.');
            });
    }, []);

    useEffect(() => {
        if (idDepartamento) {
            // Obtener ciudades del departamento seleccionado
            fetch(`https://babytracker.develotion.com/ciudades.php?idDepartamento=${idDepartamento}`)
                .then(response => response.json())
                .then(data => {
                    setListaCiudades(data.ciudades);
                })
                .catch(error => {
                    setErrorMessage('Error al cargar ciudades.');
                });
        } else {
            setListaCiudades([]);
        }
    }, [idDepartamento]);

    const formularioEnviado = (e) => {
        e.preventDefault();
        setErrorMessage('');//Limpio los mensajes de error
        const datosFormulario = {
            usuario,
            password,
            idDepartamento,
            idCiudad
        };

        // Registrar el usuario
        fetch('https://babytracker.develotion.com/usuarios.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosFormulario),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.mensaje || 'Error desconocido al registrar');
                    });
                }
                return response.json();
            })
            .then(() => {
                //El registro fue exitoso, hago login
                const datosLogin = {
                    usuario,
                    password
                };
                return fetch('https://babytracker.develotion.com/login.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(datosLogin)
                });
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.mensaje || 'Error desconocido al iniciar sesión');
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.apiKey && data.id) {
                    // Guardar credenciales en localStorage
                    localStorage.setItem('token', data.apiKey);
                    localStorage.setItem('userId', data.id);
                    // Redirigir
                    navigate('/');
                } else {
                    throw new Error('Datos de login inválidos');
                }
            })
            .catch(err => {
                setErrorMessage(`Error al registrar o iniciar sesión:: ${err.message}`);
            });
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="card my-5 card-transparent">
                        <form className="card-body p-lg-5" onSubmit={formularioEnviado}>
                            <h2 className="text-center text-gray">Registrarse</h2>
                            <div className="text-center">
                                <img
                                    src="https://img.freepik.com/foto-gratis/nina-pequena-mediano-calibre-interior_23-2151061743.jpg?t=st=1722813487~exp=1722817087~hmac=ae699859cc3d36f72e772611d5ef264d6dfaf7e45aeb5aef72f306001d619be7&w=996"
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
                                    id="username"
                                    placeholder="Usuario"
                                    value={usuario}
                                    onChange={(e) => setUsuario(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3 d-flex flex-row align-items-center">
                                <img src="/img/departamento.svg" alt="Departamento" className="me-2" />
                                <select
                                    className="form-control"
                                    id="departamento"
                                    value={idDepartamento}
                                    onChange={(e) => setIdDepartamento(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Seleccione un departamento</option>
                                    {listaDepartamentos.map(dep => (
                                        <option key={dep.id} value={dep.id}>{dep.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3 d-flex flex-row align-items-center">
                                <img src="/img/ciudad.svg" alt="Ciudad" className="me-2" />
                                <select
                                    className="form-control"
                                    id="ciudad"
                                    value={idCiudad}
                                    onChange={(e) => setIdCiudad(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Seleccione una ciudad</option>
                                    {listaCiudades.map(ci => (
                                        <option key={ci.id} value={ci.id}>{ci.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3 d-flex flex-row align-items-center">
                                <img src="/img/contraseña.svg" alt="Contraseña" className="me-2" />
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {errorMessage && (
                                <div className="alert alert-danger text-center">
                                    {errorMessage}
                                </div>
                            )}
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary px-5">
                                    <img src="/img/agregar-usuario-blanco.svg" alt="Registrarme" className="me-2" />
                                    Registrarme
                                </button>
                            </div>
                            <div className="text-center mt-3">
                                <div id="userHelp" className="form-text text-center text-dark">
                                    ¿Ya tienes una cuenta?
                                    <Link to="/Login" className="text-dark fw-bold">Iniciar Sesión</Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registro;
