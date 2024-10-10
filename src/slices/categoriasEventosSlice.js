import { createSlice } from '@reduxjs/toolkit';

const categoriasSlice = createSlice({
    name: 'categorias',
    initialState: {
        lista: []
    },
    reducers: {
        setCategorias: (state, action) => {
            state.lista = action.payload;
        }
    }
});

export const { setCategorias } = categoriasSlice.actions;
export default categoriasSlice.reducer;
