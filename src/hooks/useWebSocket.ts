import { useState, useEffect, useRef } from 'react';
import { ArbitrageData } from '../data/mockData';

export const useWebSocket = () => {
  const [arbitrageData, setArbitrageData] = useState<Record<string, ArbitrageData>>({});
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws';
        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => {
          console.log('WebSocket connected');
          setWsConnected(true);
        };

        wsRef.current.onmessage = (event) => {
          try {
            const data: ArbitrageData = JSON.parse(event.data);
            console.log('Received WebSocket data:', data);
            console.log('Spread type:', typeof data.spread, 'Value:', data.spread);
            
            // タイムスタンプを追加してデータ更新を確実に検知
            const dataWithTimestamp = {
              ...data,
              _updateTime: Date.now()
            };
            
            setArbitrageData(prev => ({
              ...prev,
              [data.pair]: dataWithTimestamp
            }));
          } catch (error) {
            console.error('Error parsing WebSocket data:', error);
          }
        };

        wsRef.current.onclose = () => {
          console.log('WebSocket disconnected');
          setWsConnected(false);
          setTimeout(connectWebSocket, 3000);
        };

        wsRef.current.onerror = () => {
          setWsConnected(false);
        };
      } catch {
        setWsConnected(false);
        setTimeout(connectWebSocket, 3000);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return {
    arbitrageData,
    wsConnected
  };
}; 