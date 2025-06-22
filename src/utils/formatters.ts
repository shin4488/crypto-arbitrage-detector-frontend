export const getExchangeColor = (exchange: string): { bg: string; color: string } => {
  const colors: Record<string, { bg: string; color: string }> = {
    'Binance': { bg: '#67e8f9', color: '#0f172a' }, // cyan-300 + slate-900
    'OKX': { bg: '#bbf7d0', color: '#0f172a' }, // green-200 + slate-900
    'Coinbase': { bg: '#c7d2fe', color: '#0f172a' }, // indigo-200 + slate-900
    'Kraken': { bg: '#e9d5ff', color: '#0f172a' } // purple-200 + slate-900
  };
  return colors[exchange] || { bg: '#6b7280', color: '#ffffff' };
};

export const formatPrice = (price: number | any): string => {
  const numPrice = typeof price === 'number' ? price : parseFloat(String(price) || '0');
  if (isNaN(numPrice)) {
    return '$0.00';
  }
  return `$${numPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatAmount = (amount: number | any, pair?: string): string => {
  const numAmount = typeof amount === 'number' ? amount : parseFloat(String(amount) || '0');
  if (isNaN(numAmount)) {
    return '0';
  }
  
  // Set decimal places based on trading pair from Binance and OKX specifications
  let decimalPlaces = 3; // default
  
  if (pair) {
    if (pair.includes('BTC')) {
      decimalPlaces = 5; // BTC/USDT: 5 decimal places
    } else if (pair.includes('ETH')) {
      decimalPlaces = 4; // ETH/USDT: 4 decimal places
    }
  }
  
  return numAmount.toFixed(decimalPlaces);
};

export const formatCrypto = (amount: number | any, symbol: string): string => {
  const numAmount = typeof amount === 'number' ? amount : parseFloat(String(amount) || '0');
  if (isNaN(numAmount)) {
    return `0 ${symbol}`;
  }
  return `${numAmount} ${symbol}`;
};

export const formatSpread = (spread: number | any, currency: string): string => {
  const numSpread = typeof spread === 'number' ? spread : parseFloat(String(spread) || '0');
  if (isNaN(numSpread)) {
    return `+0.00 ${currency}`;
  }
  return `+${numSpread.toFixed(2)} ${currency}`;
};

export const formatSpreadRatio = (ratio: number | any): string => {
  const numRatio = typeof ratio === 'number' ? ratio : parseFloat(String(ratio) || '0');
  if (isNaN(numRatio)) {
    return '+0.00%';
  }
  return `+${(numRatio * 100).toFixed(2)}%`;
}; 