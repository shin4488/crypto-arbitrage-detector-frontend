export const getExchangeColor = (
  exchange: string
): { bg: string; color: string } => {
  const colors: Record<string, { bg: string; color: string }> = {
    Binance: { bg: '#67e8f9', color: '#0f172a' }, // cyan-300 + slate-900
    OKX: { bg: '#bbf7d0', color: '#0f172a' }, // green-200 + slate-900
    Coinbase: { bg: '#c7d2fe', color: '#0f172a' }, // indigo-200 + slate-900
    Kraken: { bg: '#e9d5ff', color: '#0f172a' }, // purple-200 + slate-900
  };
  return colors[exchange] || { bg: '#6b7280', color: '#ffffff' };
};

export const formatPrice = (price: number | any): string => {
  const numPrice = typeof price === 'number' ? price : parseFloat(String(price) || '0');
  if (isNaN(numPrice)) {
    return '$0';
  }

  // デバッグログ
  console.log(`🔢 formatPrice - input: ${price} (${typeof price}), parsed: ${numPrice}`);

  // 精度を保つために、適切な小数点桁数でフォーマット
  // 暗号通貨の価格は通常、小数点以下の桁数が重要
  const formatted = numPrice.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8, // 暗号通貨の精度に合わせて8桁まで
    useGrouping: true
  });

  const result = `$${formatted}`;
  console.log(`🔢 formatPrice - result: ${result}`);
  return result;
};

export const formatAmount = (amount: number | any, pair?: string): string => {
  const numAmount =
    typeof amount === 'number' ? amount : parseFloat(String(amount) || '0');
  if (isNaN(numAmount)) {
    return '0';
  }
  return String(numAmount);
};

export const formatCrypto = (amount: number | any, symbol: string): string => {
  const numAmount =
    typeof amount === 'number' ? amount : parseFloat(String(amount) || '0');
  if (isNaN(numAmount)) {
    return `0 ${symbol}`;
  }
  return `${numAmount} ${symbol}`;
};

export const formatSpread = (
  spread: number | any,
  currency: string
): string => {
  const numSpread =
    typeof spread === 'number' ? spread : parseFloat(String(spread) || '0');
  if (isNaN(numSpread)) {
    return `+0 ${currency}`;
  }
  return `+${numSpread} ${currency}`;
};

export const formatSpreadRatio = (ratio: number | any): string => {
  const numRatio =
    typeof ratio === 'number' ? ratio : parseFloat(String(ratio) || '0');
  if (isNaN(numRatio)) {
    return '+0%';
  }
  return `+${numRatio * 100}%`;
};
