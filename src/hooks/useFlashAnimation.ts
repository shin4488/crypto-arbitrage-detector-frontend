import { useState, useEffect, useRef } from 'react';
import { ArbitrageData } from '../data/mockData';

export const useFlashAnimation = (
  arbitrageData: Record<string, ArbitrageData>
) => {
  const [flashingElements, setFlashingElements] = useState<Set<string>>(
    new Set()
  );
  const prevDataRef = useRef<Record<string, ArbitrageData>>({});
  const lastUpdateRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const newFlashingElements = new Set<string>();

    Object.entries(arbitrageData).forEach(([pair, data]) => {
      const prevData = prevDataRef.current[pair];
      const lastUpdate = lastUpdateRef.current[pair] || 0;
      const currentUpdate = (data as any)._updateTime || Date.now();

      // タイムスタンプベースで新しいデータかチェック
      const isNewData = currentUpdate > lastUpdate;

      if (prevData && isNewData) {
        // 数値比較を安全に行う関数（意味のある変化のみ検知）
        const hasChanged = (prev: any, current: any, fieldName: string) => {
          const prevNum = parseFloat(String(prev));
          const currentNum = parseFloat(String(current));
          const diff = Math.abs(prevNum - currentNum);

          // フィールドタイプに応じて閾値を設定
          let threshold = 0.01; // デフォルト: $0.01
          if (fieldName === 'amount') {
            threshold = 0.001; // 数量: 0.001
          } else if (fieldName === 'spread_ratio') {
            threshold = 0.0001; // 比率: 0.0001
          }

          const changed = diff > threshold;
          if (changed) {
            console.log(
              `📈 ${fieldName} changed: ${prevNum} -> ${currentNum} (diff: ${diff.toFixed(6)})`
            );
          }
          return changed;
        };

        // 実際に値が変化した場合のみアニメーションを発動
        let hasAnyChange = false;

        // 買い価格の変化をチェック
        const buyPriceChanged = hasChanged(
          prevData.buy_price,
          data.buy_price,
          'buy_price'
        );
        if (buyPriceChanged) {
          newFlashingElements.add(`${pair}-buy-price`);
          console.log(`🔥 Buy price flash: ${pair}`);
          hasAnyChange = true;
        }

        // 売り価格の変化をチェック
        const sellPriceChanged = hasChanged(
          prevData.sell_price,
          data.sell_price,
          'sell_price'
        );
        if (sellPriceChanged) {
          newFlashingElements.add(`${pair}-sell-price`);
          console.log(`🔥 Sell price flash: ${pair}`);
          hasAnyChange = true;
        }

        // スプレッドの変化をチェック
        if (hasChanged(prevData.spread, data.spread, 'spread')) {
          newFlashingElements.add(`${pair}-spread`);
          console.log(`🔥 Spread flash: ${pair}`);
          hasAnyChange = true;
        }

        // 数量の変化をチェック（価格が変わった側のみアニメーション）
        const amountChanged = hasChanged(
          prevData.amount,
          data.amount,
          'amount'
        );
        if (amountChanged) {
          // 買い価格が変わった場合は買い側の数量をアニメーション
          if (buyPriceChanged) {
            newFlashingElements.add(`${pair}-buy-amount`);
            console.log(`🔥 Buy amount flash: ${pair}`);
          }
          // 売り価格が変わった場合は売り側の数量をアニメーション
          if (sellPriceChanged) {
            newFlashingElements.add(`${pair}-sell-amount`);
            console.log(`🔥 Sell amount flash: ${pair}`);
          }
          // どちらの価格も変わっていない場合は両方アニメーション
          if (!buyPriceChanged && !sellPriceChanged) {
            newFlashingElements.add(`${pair}-buy-amount`);
            newFlashingElements.add(`${pair}-sell-amount`);
            console.log(`🔥 Amount flash (both): ${pair}`);
          }
          hasAnyChange = true;
        }

        // 値に変化がない場合はアニメーションを発動しない
        if (!hasAnyChange) {
          console.log(`📊 Data received but no significant changes: ${pair}`);
        }
      } else if (!prevData) {
        // 初回データの場合はアニメーションなし、タイムスタンプのみ記録
        console.log(`📊 Initial data received: ${pair}`);
      }

      // タイムスタンプを更新（値の変化に関係なく）
      if (isNewData) {
        lastUpdateRef.current[pair] = currentUpdate;
      }
    });

    if (newFlashingElements.size > 0) {
      setFlashingElements(newFlashingElements);

      // 1.2秒後にアニメーションクラスを削除
      const timer = setTimeout(() => {
        setFlashingElements(new Set());
      }, 1200);

      return () => clearTimeout(timer);
    }

    // 現在のデータを前回のデータとして保存
    prevDataRef.current = { ...arbitrageData };
  }, [arbitrageData]);

  return flashingElements;
};
