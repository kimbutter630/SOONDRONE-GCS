import { configureStore } from '@reduxjs/toolkit';
// import authSlice from './slices/authSlice';
// import droneSlice from './slices/droneSlice';
// import missionSlice from './slices/missionSlice';

const store = configureStore({
  reducer: {
    // auth: authSlice,
    // drones: droneSlice,
    // missions: missionSlice,
  },
});

export default store;
