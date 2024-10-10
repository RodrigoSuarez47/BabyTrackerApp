import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const InformeBiberones = () => {
    const [totalBiberones, setTotalBiberones] = useState(0);
    const [tiempoDesdeUltimo, setTiempoDesdeUltimo] = useState(0);
    const [mensajeError, setMensajeError] = useState('');

    const eventos = useSelector(state => state.eventos.eventos);
    const categorias = useSelector(state => state.categorias.lista);

    useEffect(() => {
        const categoria = categorias.find(categoria => categoria.tipo === 'Biberón');
        if (categoria) {
            const eventosBiberon = eventos.filter(evento => evento.idCategoria === categoria.id);
            setTotalBiberones(eventosBiberon.length);
            if (eventosBiberon.length > 0) {
                const ultimoBiberon = eventosBiberon.reduce((ultimoEvento, eventoActual) => {
                    return new Date(eventoActual.fecha) > new Date(ultimoEvento.fecha) ? eventoActual : ultimoEvento;
                });
                const ahora = new Date();
                const tiempoTranscurrido = Math.floor((ahora - new Date(ultimoBiberon.fecha)) / 60000); //Hecho con Chat-GPT
                setTiempoDesdeUltimo(tiempoTranscurrido);
                setMensajeError('');
            } else {
                setTiempoDesdeUltimo(0);
                setMensajeError('No hay biberones registrados para el día de hoy.');
            }
        } else {
            setMensajeError('No se encontró la categoría de biberones.');
        }
    }, [eventos]);

    const formatoTiempo = (minutos) => {
        if (minutos >= 60) {
            const horas = Math.floor(minutos / 60);
            const minutosRestantes = minutos % 60;
            return `${horas}h ${minutosRestantes}min`;
        } else {
            return `${minutos} minutos`;
        }
    };

    return (
        <div className="col-4">
            <div className="card card-transparent">
                <div className="card-header">
                    <h2 className="h5 mb-0 text-center">Informe de Biberones</h2>
                </div>
                <div className="card-body text-center">
                    {mensajeError ? (
                        <p className="text-danger">{mensajeError}</p>
                    ) : (
                        <>
                            <p>Total ingeridos en el día: {totalBiberones}</p>
                            <p className={tiempoDesdeUltimo > 240 ? 'text-danger' : tiempoDesdeUltimo > 230 ? 'text-warning' : ''}>
                                Tiempo desde el último: {formatoTiempo(tiempoDesdeUltimo)}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InformeBiberones;
