import { useState, useEffect } from "react";

export default function usePaginatedSearch(fetchDataFn, searchTerm) {
  const [dataList, setDataList] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetch = async (queryOrUrl) => {
    setLoading(true);
    try {
      const { data, next, previous, count } = await fetchDataFn(queryOrUrl);
      setDataList(data || []);
      setNextUrl(next);
      setPrevUrl(previous);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error en fetchDataFn:", error);
      setDataList([]);
      setNextUrl(null);
      setPrevUrl(null);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetch(null);
    } else {
      fetch(searchTerm);
    }
  }, [searchTerm]);

  return {
    dataList,
    nextUrl,
    prevUrl,
    totalCount,
    loading,
    fetch,
  };
}
