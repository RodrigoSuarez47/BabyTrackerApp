import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const ProximoBiberon = () => {
    const [tiempoRestante, setTiempoRestante] = useState('');
    const [colorTexto, setColorTexto] = useState('text-success');

    const eventos = useSelector(state => state.eventos.eventos);
    const eventosAnteriores = useSelector(state => state.eventos.eventosAnteriores);

    const calcularTiempoRestante = () => {
        const eventosBiberon = [...eventos, ...eventosAnteriores].filter(evento => evento.idCategoria === 35);

        if (eventosBiberon.length > 0) {
            const fechas = eventosBiberon.map(evento => new Date(evento.fecha));
            const ultimoBiberon = new Date(Math.max(...fechas));
            const ahora = new Date();
            const proximoBiberon = new Date(ultimoBiberon);
            proximoBiberon.setHours(proximoBiberon.getHours() + 4);

            const diferenciaMinutos = Math.floor((proximoBiberon - ahora) / (1000 * 60));

            if (diferenciaMinutos > 0) {
                const horasRestantes = Math.floor(diferenciaMinutos / 60);
                const minutosRestantes = diferenciaMinutos % 60;
                setTiempoRestante(`${horasRestantes}Hs, ${minutosRestantes}min`);
                setColorTexto('text-success');
                if (horasRestantes < 1 && minutosRestantes < 15) setColorTexto('text-warning')
            } else {
                const minutosTarde = Math.abs(diferenciaMinutos);
                const horasTarde = Math.floor(minutosTarde / 60);
                const minutosTardeRestantes = minutosTarde % 60;
                setTiempoRestante(`Tarde ${horasTarde}hs, ${minutosTardeRestantes}min`);
                setColorTexto('text-danger');

            }
        } else {
            setTiempoRestante('No hay registros de biberón');
            setColorTexto('text-warning');
        }
    };

    //Los calculos de tiempoRestante se realizan con ayuda de Chat-GPT

    useEffect(() => {
        calcularTiempoRestante();
        const interval = setInterval(calcularTiempoRestante, 60000); //Llama a la funcion cada 1 minuto

        return () => clearInterval(interval);
    }, [eventos]); //Consultado en ChatGPT

    return (
        <div className="col-md-4 d-flex align-items-center justify-content-center">
            <div className="card card-transparent" style={{ width: '100%', maxWidth: '300px' }}>
                <div className="card-header">
                    <h2 className="h5 mb-0 text-center">Próximo Biberón</h2>
                </div>
                <div className="card-body text-center">
                    <p className={colorTexto} style={{ fontSize: '1.5rem' }}>
                        {tiempoRestante}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProximoBiberon;
