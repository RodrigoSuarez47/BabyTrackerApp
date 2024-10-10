import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { eventosDelDia, eventosAnteriores, eliminarEvento } from '../slices/eventosSlice';

const ListadoEventos = () => {
    const categorias = useSelector(state => state.categorias.lista);
    const eventos = useSelector(state => state.eventos.eventos);
    const eventosDiasAnteriores = useSelector(state => state.eventos.eventosAnteriores);
    const dispatch = useDispatch();
    const [status, setStatus] = useState('');
    const [error, setError] = useState(null);
    const [eliminandoId, setEliminandoId] = useState(null);
    const [filtro, setFiltro] = useState('ambos'); // 'hoy', 'anteriores', 'ambos'

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    useEffect(() => {
        setStatus('cargando');
        fetch(`https://babytracker.develotion.com/eventos.php?idUsuario=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apikey': token,
                'iduser': userId
            }
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.mensaje || 'Error desconocido al obtener eventos');
                    });
                }
                return response.json();
            })
            .then(data => {
                const ahora = new Date();
                const eventosDelDiaRecibidos = data.eventos.filter(evento => {
                    const fechaEvento = new Date(evento.fecha);
                    return fechaEvento.toDateString() === ahora.toDateString();
                });
                const eventosPreviosRecibidos = data.eventos.filter(evento => {
                    const fechaEvento = new Date(evento.fecha);
                    return fechaEvento.toDateString() !== ahora.toDateString();
                });
                dispatch(eventosDelDia(eventosDelDiaRecibidos));
                dispatch(eventosAnteriores(eventosPreviosRecibidos));
                setStatus('completado');
            })
            .catch(error => {
                setError(error.message);
                setStatus('error');
            });
    }, [eventos.length, eventosDiasAnteriores.length]);

    const clickEliminarEvento = (eventoId) => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        setEliminandoId(eventoId);
        fetch(`https://babytracker.develotion.com/eventos.php?idEvento=${eventoId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'apikey': token,
                'iduser': userId
            },
            body: JSON.stringify({ idEvento: eventoId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.codigo === 200) {
                    dispatch(eliminarEvento(eventoId));
                } else {
                    throw new Error(data.mensaje || 'Error desconocido al eliminar el evento');
                }
            })
            .catch(error => {
                setError(error.message);
            })
            .finally(() => {
                setEliminandoId(null);
            });
    };

    const handleFiltroChange = (event) => {
        setFiltro(event.target.value);
    };

    return (
        <div className="col-12">
            <div className="card card-transparent">
                <div className="card-header">
                    <h2 className="h5 text-dark text-center mb-0">Listado de Eventos</h2>
                </div>
                <div className="card-body">
                    {status === 'cargando' && <p>Cargando eventos...</p>}
                    {status === 'error' && <div className="alert alert-danger">{error}</div>}
                    {categorias.length === 0 ? (
                        <p>Cargando categorías...</p>
                    ) : (
                        <>
                            <div className="filtro-eventos mb-3">
                                <label htmlFor="filtro">Ver:</label>
                                <select id="filtro" value={filtro} onChange={handleFiltroChange} className="form-select">
                                    <option value="hoy">Hoy</option>
                                    <option value="anteriores">Días anteriores</option>
                                    <option value="ambos">Todos</option>
                                </select>
                            </div>
                            {(filtro === 'hoy' || filtro === 'ambos') && (
                                <>
                                    <h3 className="h6">Hoy</h3>
                                    <ul className="list-group mb-4">
                                        {eventos.length > 0 ? eventos.map(evento => (
                                            <li key={`hoy-${evento.id}`} className="list-group-item d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center">
                                                    <span className='mx-5'>{evento.fecha.slice(0, 16)}</span>
                                                    {(() => {
                                                        const categoria = categorias.find(cat => cat.id === evento.idCategoria);
                                                        return categoria ? (
                                                            <>
                                                                <img
                                                                    src={`https://babytracker.develotion.com/imgs/${categoria.imagen}.png`}
                                                                    alt={categoria.tipo}
                                                                    className="me-2"
                                                                />
                                                                <span>{evento.detalle}</span>
                                                            </>
                                                        ) : (
                                                            <span>Categoría no encontrada {evento.idCategoria}</span>

                                                        );
                                                    })()}
                                                </div>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => clickEliminarEvento(evento.id)}
                                                    disabled={eliminandoId === evento.id}
                                                >
                                                    {eliminandoId === evento.id ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                            Eliminando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <img src="/img/eliminar.svg" alt="Eliminar" className='mx-2' />
                                                            Eliminar
                                                        </>
                                                    )}
                                                </button>
                                            </li>
                                        )) : <p>No hay eventos para hoy.</p>}
                                    </ul>
                                </>
                            )}

                            {(filtro === 'anteriores' || filtro === 'ambos') && (
                                <>
                                    <h3 className="h6">Días anteriores</h3>
                                    <ul className="list-group">
                                        {eventosDiasAnteriores.length > 0 ? eventosDiasAnteriores.map(evento => (
                                            <li key={`anterior-${evento.id}`} className="list-group-item d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center">
                                                    <span className='mx-5'>{evento.fecha.slice(0, 16)}</span>
                                                    {(() => {
                                                        const categoria = categorias.find(cat => cat.id === evento.idCategoria);
                                                        return categoria ? (
                                                            <>
                                                                <img
                                                                    src={`https://babytracker.develotion.com/imgs/${categoria.imagen}.png`}
                                                                    alt={categoria.tipo}
                                                                    className="me-2"
                                                                />
                                                                <span>{evento.detalle}</span>
                                                            </>
                                                        ) : (
                                                            <span>Categoría no encontrada</span>
                                                        );
                                                    })()}
                                                </div>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => clickEliminarEvento(evento.id)}
                                                    disabled={eliminandoId === evento.id}
                                                >
                                                    {eliminandoId === evento.id ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                            Eliminando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <img src="/img/eliminar.svg" alt="Eliminar" className='mx-2' />
                                                            Eliminar
                                                        </>
                                                    )}
                                                </button>
                                            </li>
                                        )) : <p>No hay eventos anteriores.</p>}
                                    </ul>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListadoEventos;
