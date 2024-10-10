import { createSlice } from '@reduxjs/toolkit';

const eventosSlice = createSlice({
    name: 'eventos',
    initialState: {
        eventos: [],
        eventosAnteriores: []
    },
    reducers: {
        eventosDelDia: (state, action) => {
            state.eventos = action.payload;
        },
        eventosAnteriores: (state, action) => {
            state.eventosAnteriores = action.payload;
        },
        eliminarEvento: (state, action) => {
            state.eventos = state.eventos.filter(evento => evento.id !== action.payload);
            state.eventosAnteriores = state.eventosAnteriores.filter(evento => evento.id !== action.payload);
        },
        agregarEvento: (state, action) => {
            const nuevoEvento = action.payload;
            const fechaEvento = new Date(nuevoEvento.fecha);
            const hoy = new Date();
            const esMismoDia = fechaEvento.getDate() === hoy.getDate() &&
                fechaEvento.getMonth() === hoy.getMonth() &&
                fechaEvento.getFullYear() === hoy.getFullYear();

            if (esMismoDia) {
                state.eventos.push(nuevoEvento);
            } else {
                state.eventosAnteriores.push(nuevoEvento);
            }
        }
    }
});

export const { eventosDelDia, eventosAnteriores, eliminarEvento, agregarEvento } = eventosSlice.actions;
export default eventosSlice.reducer;
