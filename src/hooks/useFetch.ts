import { useState, useEffect } from "react";
import api from "../services/api";

export function useFetch<T>(endpoint: string, method: string, body: object = {}) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        switch(method){
            case 'POST':
                response = await api.post<T>(endpoint, body);
                break;
            case 'GET':
                response = await api.get<T>(endpoint);
        }
        setData(response?.data ?? null);
      } catch (err) {
        setError("Erro ao buscar os dados");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
}
