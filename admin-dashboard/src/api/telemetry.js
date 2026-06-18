import client from './client';

export const getTelemetryData = (params) => client.get('/telemetry', { params });
export const getTelemetryDetail = (id) => client.get(`/telemetry/${id}`);
export const uploadTelemetryData = (data) => client.post('/telemetry', data);
