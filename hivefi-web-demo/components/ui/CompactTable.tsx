import React from "react"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// データの型定義
type IndicatorRow = {
  metric: string
  BTC: number
  Backtest: number
  Actual: number
  Description: string
}

function CompactTable({ data }: { data: IndicatorRow[] }) {
  return (
    <table className="w-full text-sm text-left text-gray-300">
      <thead className="text-xs text-gray-400 uppercase bg-gray-700">
        <tr>
          <th scope="col" className="px-4 py-2">Metric</th>
          <th scope="col" className="px-4 py-2">BTC</th>
          <th scope="col" className="px-4 py-2">Backtest</th>
          <th scope="col" className="px-4 py-2">Actual</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.metric} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700">
            {/* Metric 列にツールチップを追加 */}
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <div className="w-full px-4 py-2 font-medium text-white whitespace-nowrap">
                    {row.metric}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" align="center" sideOffset={8}>
                  <p className="text-sm text-gray-100">{row.Description || "No description available"}</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
            {/* BTC 列の値を表示 */}
            <td className="px-4 py-2">
              {row.metric.includes("Return") || row.metric.includes("APY") || row.metric.includes("Volatility") || row.metric.includes("VaR") || row.metric.includes("Win Rate") || row.metric.includes("Drawdown")
                ? `${row.BTC?.toFixed(2)}%`
                : row.metric === "Sharpe Ratio" || row.metric === "P/L Ratio"
                ? row.BTC?.toFixed(2)
                : Math.round(row.BTC)}
            </td>
            {/* Backtest 列の値を表示 */}
            <td className="px-4 py-2">
              {row.metric.includes("Return") || row.metric.includes("APY") || row.metric.includes("Volatility") || row.metric.includes("VaR") || row.metric.includes("Win Rate") || row.metric.includes("Drawdown")
                ? `${row.Backtest?.toFixed(2)}%`
                : row.metric === "Sharpe Ratio" || row.metric === "P/L Ratio"
                ? row.Backtest?.toFixed(2)
                : Math.round(row.Backtest)}
            </td>
            {/* Actual 列の値を表示 */}
            <td className="px-4 py-2">
              {row.metric.includes("Return") || row.metric.includes("APY") || row.metric.includes("Volatility") || row.metric.includes("VaR") || row.metric.includes("Win Rate") || row.metric.includes("Drawdown")
                ? `${row.Actual?.toFixed(2)}%`
                : row.metric === "Sharpe Ratio" || row.metric === "P/L Ratio"
                ? row.Actual?.toFixed(2)
                : Math.round(row.Actual)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CompactTable
