import { useDispatch, useSelector } from 'react-redux';
import { setDrones, setLoading, setError } from '../store/slices/droneSlice';
import * as dronesAPI from '../api/drones';

export const useDrones = () => {
  const dispatch = useDispatch();
  const { drones, loading, error } = useSelector(state => state.drones);

  const fetchDronesList = async (params = {}) => {
    dispatch(setLoading(true));
    try {
      const response = await dronesAPI.getDronesList(params);
      dispatch(setDrones(response.data.data));
      dispatch(setError(null));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchDroneStatus = async (id) => {
    try {
      const response = await dronesAPI.getDroneStatus(id);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  return {
    drones,
    loading,
    error,
    fetchDronesList,
    fetchDroneStatus,
  };
};
