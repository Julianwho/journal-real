
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Calculator, Trash2, TrendingUp, DollarSign, PercentIcon, Calendar } from 'lucide-react';
import './TradingJournalPro.css';  // Assuming the CSS file for additional styling

export default function TradingJournalPro() {
  const [initialBalance, setInitialBalance] = useState(10000);
  const [trades, setTrades] = useState([]);
  const [newTrade, setNewTrade] = useState({
    date: new Date().toISOString().split('T')[0],
    pair: '',
    type: 'long',
    result: '',
    notes: '',
  });
  const [statistics, setStatistics] = useState({
    winRate: 0,
    avgWin: 0,
    avgLoss: 0,
    biggestWin: 0,
    biggestLoss: 0,
    profitFactor: 0,
    totalTrades: 0,
  });

  // Calculate the statistics whenever trades change
  useEffect(() => {
    calculateStatistics();
  }, [trades]);

  // Function to handle form input changes
  const handleInputChange = (e) => {
    setNewTrade({ ...newTrade, [e.target.name]: e.target.value });
  };

  // Function to add a new trade to the journal
  const addTrade = () => {
    setTrades([...trades, { ...newTrade, result: parseFloat(newTrade.result) }]);
    setNewTrade({
      date: new Date().toISOString().split('T')[0],
      pair: '',
      type: 'long',
      result: '',
      notes: '',
    });
  };

  // Calculate statistics such as win rate, average wins/losses, etc.
  const calculateStatistics = () => {
    if (trades.length === 0) {
      setStatistics({
        winRate: 0,
        avgWin: 0,
        avgLoss: 0,
        biggestWin: 0,
        biggestLoss: 0,
        profitFactor: 0,
        totalTrades: 0,
      });
      return;
    }

    const wins = trades.filter(trade => trade.result > 0);
    const losses = trades.filter(trade => trade.result < 0);
    const totalTrades = trades.length;

    const avgWin = wins.reduce((sum, trade) => sum + trade.result, 0) / wins.length || 0;
    const avgLoss = losses.reduce((sum, trade) => sum + trade.result, 0) / losses.length || 0;
    const biggestWin = Math.max(...wins.map(trade => trade.result), 0);
    const biggestLoss = Math.min(...losses.map(trade => trade.result), 0);

    setStatistics({
      winRate: (wins.length / totalTrades) * 100,
      avgWin: avgWin,
      avgLoss: avgLoss,
      biggestWin: biggestWin,
      biggestLoss: biggestLoss,
      profitFactor: (wins.reduce((sum, trade) => sum + trade.result, 0) /
                    Math.abs(losses.reduce((sum, trade) => sum + trade.result, 0)) || 0),
      totalTrades: totalTrades,
    });
  };

  // Data for the progress curve chart
  const progressData = trades.map((trade, index) => ({
    name: `Trade ${index + 1}`,
    balance: initialBalance + trades.slice(0, index + 1).reduce((sum, trade) => sum + trade.result, 0)
  }));

  return (
    <div className="journal-container">
      <h1>Trading Journal Pro</h1>

      <div className="balance-display">
        <h2>Initial Balance: ${initialBalance}</h2>
        <h2>Current Balance: ${initialBalance + trades.reduce((sum, trade) => sum + trade.result, 0)}</h2>
      </div>

      <div className="trade-form">
        <input type="date" name="date" value={newTrade.date} onChange={handleInputChange} />
        <input type="text" name="pair" placeholder="Pair" value={newTrade.pair} onChange={handleInputChange} />
        <select name="type" value={newTrade.type} onChange={handleInputChange}>
          <option value="long">Long</option>
          <option value="short">Short</option>
        </select>
        <input type="number" name="result" placeholder="Result" value={newTrade.result} onChange={handleInputChange} />
        <input type="text" name="notes" placeholder="Notes" value={newTrade.notes} onChange={handleInputChange} />
        <button onClick={addTrade}>Add Trade</button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={progressData}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="balance" stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>

      <div className="statistics-section">
        <h2>Statistics</h2>
        <p>Total Trades: {statistics.totalTrades}</p>
        <p>Win Rate: {statistics.winRate.toFixed(2)}%</p>
        <p>Average Win: ${statistics.avgWin.toFixed(2)}</p>
        <p>Average Loss: ${statistics.avgLoss.toFixed(2)}</p>
        <p>Biggest Win: ${statistics.biggestWin.toFixed(2)}</p>
        <p>Biggest Loss: ${statistics.biggestLoss.toFixed(2)}</p>
        <p>Profit Factor: {statistics.profitFactor.toFixed(2)}</p>
      </div>
    </div>
  );
}
