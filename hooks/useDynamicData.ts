
import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { SubModuleRecord, SubModuleField } from '../types';

export const useDynamicData = (moduleCode?: string) => {
  const [records, setRecords] = useState<SubModuleRecord[]>([]);
  const [fields, setFields] = useState<SubModuleField[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!moduleCode) return;
    setLoading(true);
    try {
      const response = await api.getRecords(moduleCode);
      // In a real app, the API would return both fields and data
      // FIXED: removed .data as the mock api returns { records, fields } directly
      setRecords(response.records);
      setFields(response.fields);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [moduleCode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addRecord = async (data: any) => {
    if (!moduleCode) return;
    try {
      await api.createRecord(moduleCode, data);
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to add record');
    }
  };

  const updateRecord = async (id: string, data: any) => {
    if (!moduleCode) return;
    try {
      // Fix: Line 45: Removed moduleCode argument to match api.updateRecord(id, recordData)
      await api.updateRecord(id, data);
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to update record');
    }
  };

  const deleteRecord = async (id: string) => {
    if (!moduleCode) return;
    try {
      // Fix: Line 55: Corrected call to deleteRecord and removed moduleCode as it only requires id
      await api.deleteRecord(id);
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete record');
    }
  };

  return { records, fields, loading, error, addRecord, updateRecord, deleteRecord, refresh: fetchData };
};
