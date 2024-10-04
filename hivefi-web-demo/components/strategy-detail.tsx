"use client"

import Image from "next/image"
import React, { useState, useEffect } from "react"
import Link from "next/link" // Next.js Link コンポーネント
import { Button } from "@/components/ui/button"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Wallet, TrendingUp, Target, Percent, DollarSign } from "lucide-react"
import Papa from "papaparse"
import PerformanceChart from "./ui/PerformanceChart"
import CompactTable from "./ui/CompactTable"

const FILE_PATH = "/csv/performance_metrics_result.csv"

type IndicatorRow = {
  metric: string
  BTC: number
  Backtest: number
  Actual: number
  Description?: string
}

export default function StrategyDetailPage() {
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [indicatorData, setIndicatorData] = useState<IndicatorRow[]>([])
  const [activeTab, setActiveTab] = useState("Overview")

  useEffect(() => {
    Papa.parse<IndicatorRow>(FILE_PATH, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const enrichedData = results.data.map((row) => ({
          ...row,
          Description: getMetricDescription(row.metric),
        }))
        setIndicatorData(enrichedData)
      },
      error: (error) => {
        console.error("Error loading CSV file:", error)
      },
    })
  }, [])

  const getMetricDescription = (metric: string) => {
    const descriptions: Record<string, string> = {
      "Number of Trades": "The total number of trades executed by the strategy. Higher values indicate more trade samples.",
      "Cumulative Return (%)": "The overall percentage return of the strategy over the period.",
      "APY (%)": "Annual Percentage Yield, representing the annualized return of the strategy.",
      "Annualized Volatility (%)": "Indicates the annualized standard deviation of returns, representing risk.",
      "Sharpe Ratio": "Measures risk-adjusted return. A higher value indicates a better risk/return trade-off.",
      "Maximum Drawdown (%)": "The maximum observed loss from a peak to a trough, indicating the worst-case scenario.",
      "VaR (%)": "Value at Risk, estimating the potential loss over a set time period under normal market conditions.",
      "Win Rate (%)": "The percentage of winning trades out of the total trades executed.",
      "P/L Ratio": "Profit/Loss Ratio, showing the average profit relative to the average loss.",
      "TVL": "Total Value Locked: The total amount of assets locked in the strategy, indicating the trust and interest of users.",
    }
    return descriptions[metric] || "No description available."
  }

  const cards = [
    {
      name: "APY",
      value: indicatorData.find((row) => row.metric === "APY (%)")?.Actual,
      icon: Percent,
      color: "text-green-500",
      description: getMetricDescription("APY (%)"),
      format: (value: number) => `${Math.round(value)}%`,
    },
    {
      name: "Sharpe Ratio",
      value: indicatorData.find((row) => row.metric === "Sharpe Ratio")?.Actual,
      icon: TrendingUp,
      color: "text-blue-500",
      description: getMetricDescription("Sharpe Ratio"),
      format: (value: number) => value.toFixed(2).toString(),
    },
    {
      name: "Number of Trades",
      value: indicatorData.find((row) => row.metric === "Number of Trades")?.Actual,
      icon: Target,
      color: "text-purple-500",
      description: getMetricDescription("Number of Trades"),
      format: (value: number) => `${Math.floor(value)}`,
    },
    {
      name: "TVL",
      value: 123000, // 適当な値を設定
      icon: DollarSign,
      color: "text-yellow-500",
      description: getMetricDescription("TVL"),
      format: (value: number) => `$${(value / 1000).toFixed(0)}K`,
    },
  ]

  const handleWalletConnection = () => {
    setIsWalletConnected(!isWalletConnected)
  }

  return (
    <div className="w-full mx-auto p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen font-inter">
      {/* ナビゲーションバー */}
    <nav className="bg-gray-800 p-4 rounded-md mb-6 flex items-center">
      <div className="flex items-center">
        <Link href="/">
          <Image src="/public/logo.png" alt="Logo" width={50} height={50} className="cursor-pointer mr-4" />
        </Link>
        <h1 className="text-xl font-bold">HiveFi</h1>
      </div>
      <div className="flex space-x-4 ml-auto">
        {/* 修正: ml-auto で右に寄せる */}
        <Link href="/" className="text-gray-300 hover:text-blue-400">Home</Link>
        <Link href="/strategies" className="text-gray-300 hover:text-blue-400">Strategies</Link>
        <Link href="/education" className="text-gray-300 hover:text-blue-400">Education</Link>
        <Link href="/about" className="text-gray-300 hover:text-blue-400">About Us</Link>
      </div>
      <Button onClick={handleWalletConnection} variant="outline" className="bg-gray-800 text-white border-gray-600 hover:bg-gray-700 text-xs py-1 px-2 ml-4">
        <Wallet className="mr-1 h-3 w-3" />
        {isWalletConnected ? "Connected" : "Connect"}
      </Button>
    </nav>


      {/* ダミータブの追加 */}
      <div className="flex mt-4 space-x-4 border-b border-gray-600">
        {["Overview", "Performance", "Details", "Settings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === tab ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* カード形式の指標セクション */}
      <section className="grid grid-cols-4 gap-2 mb-6 mt-6">
        {cards.map((card) => (
          <TooltipProvider key={card.name}>
            <UITooltip>
              <TooltipTrigger asChild>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center">
                  <card.icon className={`h-6 w-6 ${card.color} mb-1`} />
                  <h3 className="text-md font-semibold text-gray-300">{card.name}</h3>
                  <p className="text-xl font-bold text-white">{card.value !== undefined ? card.format(card.value) : "N/A"}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm text-gray-100">{card.description}</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        ))}
      </section>


      {/* チャートとデポジットパネルの並列表示 */}
      <div className="flex mb-6 items-start">
        <section className="w-3/4 mr-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-300">Performance Chart</h2>
          <div className="bg-gray-800 p-4 rounded-lg">
            <PerformanceChart />
          </div>
        </section>
        <section className="w-1/4">
          <DepositPanel />
        </section>
      </div>


      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-300">Detailed Performance Metrics</h2>
        <div className="bg-gray-800 p-4 rounded-lg overflow-auto">
          <CompactTable data={indicatorData} />
        </div>
      </section>
    </div>
  )
}



// デポジット用パネルのコンポーネント
function DepositPanel() {
  const [depositAmount, setDepositAmount] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepositAmount(e.target.value)
  }

  const handleDeposit = () => {
    alert(`You have successfully deposited: $${depositAmount}`)
    setDepositAmount("")
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-300">Deposit Panel</h2>
      <div className="mb-4">
        <label htmlFor="deposit" className="block text-sm font-medium text-gray-300 mb-2">Deposit Amount (USD)</label>
        <input
          type="number"
          id="deposit"
          value={depositAmount}
          onChange={handleInputChange}
          placeholder="Enter amount"
          className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white"
        />
      </div>
      <button
        onClick={handleDeposit}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 rounded-md transition-all duration-300 transform hover:scale-105"
      >
        Deposit
      </button>
    </div>
  )
}