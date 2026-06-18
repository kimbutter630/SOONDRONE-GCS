import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  drones: [],
  selectedDrone: null,
  loading: false,
  error: null,
};

const droneSlice = createSlice({
  name: 'drones',
  initialState,
  reducers: {
    setDrones: (state, action) => {
      state.drones = action.payload;
    },
    selectDrone: (state, action) => {
      state.selectedDrone = action.payload;
    },
    addDrone: (state, action) => {
      state.drones.push(action.payload);
    },
    updateDrone: (state, action) => {
      const index = state.drones.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.drones[index] = action.payload;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setDrones, selectDrone, addDrone, updateDrone, setLoading, setError } = droneSlice.actions;
export default droneSlice.reducer;
