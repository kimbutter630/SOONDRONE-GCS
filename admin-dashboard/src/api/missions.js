import client from './client';

export const getMissionsList = (params) => client.get('/missions', { params });
export const getMissionDetail = (id) => client.get(`/missions/${id}`);
export const createMission = (data) => client.post('/missions', data);
export const updateMission = (id, data) => client.put(`/missions/${id}`, data);
export const deleteMission = (id) => client.delete(`/missions/${id}`);
export const generateSurveyPath = (data) => client.post('/missions/generate-survey', data);
export const startMission = (id) => client.post(`/missions/${id}/start`);
export const stopMission = (id) => client.post(`/missions/${id}/stop`);
