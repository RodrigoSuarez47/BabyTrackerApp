import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const InformePañales = () => {
    const [totalPañales, setTotalPañales] = useState(0);
    const [tiempoDesdeUltimo, setTiempoDesdeUltimo] = useState(0);
    const [mensajeError, setMensajeError] = useState('');

    const eventos = useSelector(state => state.eventos.eventos);
    const categorias = useSelector(state => state.categorias.lista);

    useEffect(() => {
        const categoria = categorias.find(categoria => categoria.tipo === 'Pañal');
        if (categoria) {
            const eventosPañal = eventos.filter(evento => evento.idCategoria === categoria.id);
            setTotalPañales(eventosPañal.length);
            if (eventosPañal.length > 0) {
                const ultimoPañal = eventosPañal.reduce((ultimoEvento, eventoActual) => {
                    return new Date(eventoActual.fecha) > new Date(ultimoEvento.fecha) ? eventoActual : ultimoEvento;
                });
                const ahora = new Date();
                const tiempoTranscurrido = Math.floor((ahora - new Date(ultimoPañal.fecha)) / 60000);
                setTiempoDesdeUltimo(tiempoTranscurrido);
                setMensajeError('');
            } else {
                setTiempoDesdeUltimo(0);
                setMensajeError('No hay pañales registrados para el día de hoy.');
            }
        } else {
            setMensajeError('No se encontró la categoría de pañales.');
        }
    }, [eventos]);

    const formatoTiempo = (minutos) => {
        if (minutos >= 60) {
            const horas = Math.floor(minutos / 60);
            const minutosRestantes = minutos % 60;
            return `${horas}h ${minutosRestantes}m`;
        }
        return `${minutos} minutos`;
    };

    return (
        <div className="col-4">
            <div className="card card-transparent">
                <div className="card-header">
                    <h2 className="h5 mb-0 text-center">Informe de Pañales</h2>
                </div>
                <div className="card-body text-center">
                    {mensajeError ? (
                        <p className="text-danger">{mensajeError}</p>
                    ) : (
                        <>
                            <p>Total cambios del día: {totalPañales}</p>
                            <p className={tiempoDesdeUltimo > 320 ? 'text-warning' : ''}>
                                Tiempo desde el último: {formatoTiempo(tiempoDesdeUltimo)}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InformePañales;
