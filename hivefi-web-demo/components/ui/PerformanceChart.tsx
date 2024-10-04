"use client"

import React, { useState, useEffect } from "react"
import { Line } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js"
import Papa from "papaparse"

// Chart.js の設定
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// CSV ファイルのパスを定義
const FILES: Record<string, string> = {
  actual: "/csv/actual.csv",
  backtest: "/csv/backtest.csv",
  btc: "/csv/btc.csv",
}

// データの型を定義
type CSVRow = {
  timestamp: string
  Actual?: number
  Backtest?: number
  BTC?: number
}

// Chart.js のデータ構造を定義
type ChartData = {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    borderWidth: number
    fill: boolean
    tension: number
    pointRadius: number
    pointHoverRadius: number
  }[]
}

export default function PerformanceChart() {
  const [chartData, setChartData] = useState<ChartData>({ labels: [], datasets: [] })

  // CSV データを読み込み、指定したキーで整形する
  const loadCSVData = (filePath: string, key: keyof CSVRow): Promise<CSVRow[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse<CSVRow>(filePath, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          const formattedData = results.data.map((row) => ({
            timestamp: row.timestamp,
            [key]: parseFloat(row[key]?.toString() || "0") || NaN,
          }))
          resolve(formattedData)
        },
        error: (error) => reject(error),
      })
    })
  }

  // 複数の CSV を読み込み、日付をキーとしてデータを統合
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [actualData, backtestData, btcData] = await Promise.all([
          loadCSVData(FILES.actual, "Actual"),
          loadCSVData(FILES.backtest, "Backtest"),
          loadCSVData(FILES.btc, "BTC"),
        ])

        // タイムスタンプを全てのデータから抽出し、ユニークかつソートしたリストを作成
        const allTimestamps = [
          ...new Set([
            ...actualData.map((d) => d.timestamp),
            ...backtestData.map((d) => d.timestamp),
            ...btcData.map((d) => d.timestamp),
          ]),
        ].sort()

        // 各タイムスタンプに対してデータをマージ
        const mergedData: CSVRow[] = allTimestamps.map((timestamp) => ({
          timestamp,
          Actual: actualData.find((item) => item.timestamp === timestamp)?.Actual || NaN,
          Backtest: backtestData.find((item) => item.timestamp === timestamp)?.Backtest || NaN,
          BTC: btcData.find((item) => item.timestamp === timestamp)?.BTC || NaN,
        }))

        // グラフデータを Chart.js の形式に整形
        setChartData({
          labels: mergedData.map((d) => d.timestamp),
          datasets: [
            {
              label: "Actual",
              data: mergedData.map((d) => d.Actual || NaN),
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
              fill: false,
              tension: 0,
              pointRadius: 0, // データポイントの丸を消す
              pointHoverRadius: 0, // ホバー時も丸を消す
            },
            {
              label: "Backtest",
              data: mergedData.map((d) => d.Backtest || NaN),
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
              fill: false,
              tension: 0,
              pointRadius: 0, // データポイントの丸を消す
              pointHoverRadius: 0, // ホバー時も丸を消す
            },
            {
              label: "BTC HODL",
              data: mergedData.map((d) => d.BTC || NaN),
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
              fill: false,
              tension: 0,
              pointRadius: 0, // データポイントの丸を消す
              pointHoverRadius: 0, // ホバー時も丸を消す
            },
          ],
        })
      } catch (error) {
        console.error("Error loading CSV files:", error)
      }
    }

    fetchData()
  }, [])

  // Chart.js のオプション設定
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        enabled: true, // ホバー時にツールチップを表示
        callbacks: {
          label: function (tooltipItem: any) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw.toLocaleString()}`
          },
          title: function (tooltipItems: any) {
            return `Date: ${tooltipItems[0].label}` // タイトルに日時を表示
          },
        },
      },
    },
    hover: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      x: {
        display: false, // X 軸を非表示
      },
      y: {
        display: true,
        ticks: {
          color: "#9CA3AF",
        },
        grid: {
          color: "#374151",
        },
      },
    },
    interaction: {
      mode: "nearest" as const, // クロスヘアを表示する設定
      axis: "x", // 縦方向に動かす
      intersect: false,
    },
  }

  return <Line data={chartData} options={options} height={100} />

}
