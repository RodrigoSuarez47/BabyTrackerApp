// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import eventosReducer from '../slices/eventosSlice';
import categoriasReducer from '../slices/categoriasEventosSlice'

const store = configureStore({
    reducer: {
        eventos: eventosReducer,
        categorias: categoriasReducer
    },
});

export default store;
