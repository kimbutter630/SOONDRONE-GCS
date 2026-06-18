import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  missions: [],
  selectedMission: null,
  loading: false,
  error: null,
};

const missionSlice = createSlice({
  name: 'missions',
  initialState,
  reducers: {
    setMissions: (state, action) => {
      state.missions = action.payload;
    },
    selectMission: (state, action) => {
      state.selectedMission = action.payload;
    },
    addMission: (state, action) => {
      state.missions.push(action.payload);
    },
    updateMission: (state, action) => {
      const index = state.missions.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.missions[index] = action.payload;
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

export const { setMissions, selectMission, addMission, updateMission, setLoading, setError } = missionSlice.actions;
export default missionSlice.reducer;
