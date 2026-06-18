import { useDispatch, useSelector } from 'react-redux';
import { setMissions, setLoading, setError } from '../store/slices/missionSlice';
import * as missionsAPI from '../api/missions';

export const useMissions = () => {
  const dispatch = useDispatch();
  const { missions, loading, error } = useSelector(state => state.missions);

  const fetchMissionsList = async (params = {}) => {
    dispatch(setLoading(true));
    try {
      const response = await missionsAPI.getMissionsList(params);
      dispatch(setMissions(response.data.data));
      dispatch(setError(null));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const createNewMission = async (missionData) => {
    try {
      const response = await missionsAPI.createMission(missionData);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  return {
    missions,
    loading,
    error,
    fetchMissionsList,
    createNewMission,
  };
};
