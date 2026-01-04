
import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { SubModule, SubModuleField } from '../types';

export const useSchema = (moduleCode?: string) => {
  const [subModule, setSubModule] = useState<SubModule | null>(null);
  const [fields, setFields] = useState<SubModuleField[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchema = useCallback(async () => {
    if (!moduleCode) return;
    setLoading(true);
    try {
      const subs = await api.getSubModules();
      const sub = subs.find(s => s.code === moduleCode);
      if (sub) {
        setSubModule(sub);
        const f = await api.getFields(sub.id);
        setFields(f.sort((a, b) => a.sort_order - b.sort_order));
      } else {
        setError('Submodule not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch schema');
    } finally {
      setLoading(false);
    }
  }, [moduleCode]);

  useEffect(() => {
    fetchSchema();
  }, [fetchSchema]);

  return { subModule, fields, loading, error, refresh: fetchSchema };
};
