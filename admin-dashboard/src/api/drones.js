import client from './client';

export const getDronesList = (params) => client.get('/drones', { params });
export const getDroneDetail = (id) => client.get(`/drones/${id}`);
export const getDroneStatus = (id) => client.get(`/drones/${id}/status`);
export const registerDrone = (data) => client.post('/drones', data);
export const updateDrone = (id, data) => client.put(`/drones/${id}`, data);
export const deleteDrone = (id) => client.delete(`/drones/${id}`);
