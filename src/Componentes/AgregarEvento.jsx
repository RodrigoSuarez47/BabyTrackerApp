import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategorias } from "../slices/categoriasEventosSlice";
import { agregarEvento } from "../slices/eventosSlice";

const AgregarEvento = () => {
    const dispatch = useDispatch();
    const listaCategorias = useSelector(state => state.categorias.lista);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [fecha, setFecha] = useState('');
    const [detalles, setDetalles] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        fetch(`https://babytracker.develotion.com/categorias.php`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apikey': localStorage.getItem("token"),
                'iduser': localStorage.getItem("userId")
            },
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
                dispatch(setCategorias(data.categorias));
            })
            .catch(error => {
                setErrorMessage('Error al cargar las categorías.');
            });
    }, [dispatch]);

    const ahora = new Date();
    ahora.setHours(ahora.getHours() - 3);
    const fechaFormateada = ahora.toISOString().slice(0, 16);

    const FormAgregarEvento = (e) => {
        e.preventDefault();
        setCargando(true);

        if (fecha && fecha > fechaFormateada) {
            setErrorMessage('La fecha y hora no pueden ser mayores que la fecha actual.');
            setCargando(false);
            return;
        }

        const bodyData = {
            idCategoria: categoriaSeleccionada,
            idUsuario: localStorage.getItem("userId"),
            detalle: detalles,
            fecha: fecha ? fecha : fechaFormateada
        };

        fetch(`https://babytracker.develotion.com/eventos.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': localStorage.getItem("token"),
                'iduser': localStorage.getItem("userId")
            },
            body: JSON.stringify(bodyData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.codigo === 200) {
                    setSuccessMessage('Evento agregado exitosamente.');
                    setErrorMessage('');
                    const nuevoEvento = {
                        ...bodyData,
                        id: data.idEvento
                    };
                    dispatch(agregarEvento(nuevoEvento));
                    setCategoriaSeleccionada('');
                    setFecha('');
                    setDetalles('')
                } else {
                    setSuccessMessage('');
                    throw new Error(data.mensaje || 'Error desconocido al agregar el evento');
                }
            })
            .catch(error => {
                setErrorMessage(error.message);
            })
            .finally(() => {
                setCargando(false);
            });
    };

    return (
        <div className="col-md-6 mb-4">
            <div className="card card-transparent">
                <div className="card-header">
                    <h2 className="h5 text-center mb-0">Agregar un Evento</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={FormAgregarEvento}>
                        <div className="mb-3">
                            <label className="form-label">Categoría</label>
                            <select
                                name="categoryId"
                                className="form-select"
                                value={categoriaSeleccionada}
                                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                                required
                            >
                                <option value="" disabled>Seleccione una categoría</option>
                                {listaCategorias.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.tipo}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Fecha y hora</label>
                            <input
                                type="datetime-local"
                                name="date"
                                className="form-control"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                max={fechaFormateada}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Detalles</label>
                            <input
                                type="text"
                                name="details"
                                className="form-control"
                                value={detalles}
                                onChange={(e) => setDetalles(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary w-100 mb-3" disabled={cargando}>
                            {cargando ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Agregando el evento...
                                </>
                            ) : (
                                <>
                                    <img src="/img/agregar.svg" alt="Agregar" className='mx-2' />
                                    Agregar Evento
                                </>
                            )}
                        </button>
                        {errorMessage && (
                            <div className="alert alert-danger text-center">
                                {errorMessage}
                            </div>
                        )}
                        {successMessage && (
                            <div className="alert alert-success text-center">
                                {successMessage}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AgregarEvento;
