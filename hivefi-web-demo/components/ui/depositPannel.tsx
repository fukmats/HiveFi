"use client"

import React, { useState } from "react"


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

export default DepositPanel