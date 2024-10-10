import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useSelector } from 'react-redux';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraficoPorCategoria = () => {
    const eventos = useSelector(state => state.eventos.eventos);
    const categorias = useSelector(state => state.categorias.lista);

    const conteoCategorias = eventos.reduce((conteo, evento) => {
        if (evento.idCategoria in conteo) {
            conteo[evento.idCategoria]++;
        } else {
            conteo[evento.idCategoria] = 1;
        }
        return conteo;
    }, {});

    const categoriasConEventos = categorias.filter(cat => conteoCategorias[cat.id]);

    const data = {
        labels: categoriasConEventos.map(cat => cat.tipo),
        datasets: [{
            label: 'Cantidad de Eventos',
            data: categoriasConEventos.map(cat => conteoCategorias[cat.id]),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return context.label + ': ' + context.raw + ' eventos';
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true
            },
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                }
            }
        }
    };

    return (
        <div className="card card-transparent">
            <div className="card-header">
                <h2 className="h5 mb-0 text-center">Análisis por Categoría</h2>
            </div>
            <div className="card-body d-flex justify-content-center">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default GraficoPorCategoria;
