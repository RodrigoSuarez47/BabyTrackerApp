import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';
import { useSelector } from 'react-redux';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const GraficoComidasUltimaSemana = () => {
    const eventos = useSelector(state => state.eventos.eventos);
    const eventosAnteriores = useSelector(state => state.eventos.eventosAnteriores);
    const categorias = useSelector(state => state.categorias.lista);

    const haceUnaSemana = new Date();
    haceUnaSemana.setDate(haceUnaSemana.getDate() - 7);

    const categoriaComida = categorias.find(cat => cat.tipo === 'Comida');
    const categoriaBiberon = categorias.find(cat => cat.tipo === 'Biberón');

    const eventosTotales = [...eventos, ...eventosAnteriores];
    const eventosUltimaSemana = eventosTotales.filter(evento => new Date(evento.fecha) >= haceUnaSemana);
    const eventosParaGrafico = eventosUltimaSemana.filter(evento => evento.idCategoria === categoriaComida.id || evento.idCategoria === categoriaBiberon.id);

    const conteoPorDia = {};
    for (let i = 0; i < 7; i++) {
        const fecha = new Date();
        fecha.setDate(haceUnaSemana.getDate() + i);
        const fechaStr = fecha.toISOString().slice(0, 10);
        conteoPorDia[fechaStr] = 0;
    }

    eventosParaGrafico.forEach(evento => {
        const fecha = new Date(evento.fecha).toISOString().slice(0, 10); // YYYY-MM-DD
        conteoPorDia[fecha] = (conteoPorDia[fecha] || 0) + 1;
    });

    const fechas = Object.keys(conteoPorDia).sort(); //Hecho con Chat-GPT
    const conteo = fechas.map(fecha => conteoPorDia[fecha]); ////Hecho con Chat-GPT

    const data = {
        labels: fechas,
        datasets: [
            {
                label: 'Número de Comidas',
                data: conteo,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Comidas de la Última Semana',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Fecha'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Número de Comidas'
                },
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    return (
        <div className="row-mb-4 mb-md-0">
            <div className="card card-transparent">
                <div className="card-header">
                    <h2 className="h5 mb-0 text-center">Análisis de Comidas</h2>
                </div>
                <div className="card-body d-flex justify-content-center">
                    <Line data={data} options={options} />
                </div>
            </div>
        </div>
    );
};

export default GraficoComidasUltimaSemana;
