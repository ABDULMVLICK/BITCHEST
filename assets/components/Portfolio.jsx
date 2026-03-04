import React, { useState, useEffect } from 'react';

/**
 * Displays the user's cryptocurrency portfolio.
 *
 * For each held cryptocurrency, shows:
 * - Current quantity
 * - Purchase history (date, quantity, price per unit)
 * - PMP (weighted average purchase price per unit)
 * - Current price and total value
 * - Unrealised gain/loss
 * - Sell form
 *
 * @param {Function} onBalanceChange - Called with new EUR balance after a sale
 */
const Portfolio = ({ onBalanceChange }) => {
    const [portfolio, setPortfolio] = useState(null);
    const [sellForm,  setSellForm]  = useState({ coin: null, quantity: '' });
    const [msg,       setMsg]       = useState(null);

    const loadPortfolio = () => {
        fetch('/api/portfolio')
            .then(r => r.json())
            .then(setPortfolio)
            .catch(() => {});
    };

    useEffect(loadPortfolio, []);

    /** Submits a sell order for the selected coin. */
    const handleSell = async (e) => {
        e.preventDefault();
        const res  = await fetch('/api/sell', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ coin: sellForm.coin, quantity: parseFloat(sellForm.quantity) }),
        });
        const data = await res.json();

        if (res.ok) {
            setMsg({ ok: true, text: `Sold ${sellForm.coin}. Gain: €${Number(data.gain).toFixed(2)}` });
            onBalanceChange?.(data.eur_balance);
            setSellForm({ coin: null, quantity: '' });
            loadPortfolio();
        } else {
            setMsg({ ok: false, text: data.error || 'Sale failed.' });
        }
    };

    if (!portfolio) return <p className="text-gray-500">Loading portfolio...</p>;

    return (
        <div>
            <p className="mb-4 font-medium">
                EUR Balance:{' '}
                <span className="font-mono">€{Number(portfolio.eur_balance).toFixed(2)}</span>
            </p>

            {msg && (
                <p className={`px-3 py-2 rounded mb-4 border ${msg.ok ? 'bg-green-50 border-green-300 text-green-700' : 'bg-red-50 border-red-300 text-red-700'}`}>
                    {msg.text}
                    <button className="ml-2 underline" onClick={() => setMsg(null)}>×</button>
                </p>
            )}

            {portfolio.portfolio.length === 0 ? (
                <p className="text-gray-500">
                    No holdings yet. Go to the <strong>Market</strong> tab to buy your first crypto.
                </p>
            ) : (
                portfolio.portfolio.map(item => (
                    <div key={item.currency} className="border border-gray-200 rounded mb-4 bg-white">
                        {/* Coin header with gain/loss indicator */}
                        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                            <span className="font-bold">{item.currency}</span>
                            <span className={`font-mono font-medium ${item.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {item.gain >= 0 ? '+' : ''}€{Number(item.gain).toFixed(2)}
                            </span>
                        </div>

                        <div className="px-4 py-3">
                            {/* Summary grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                <div>
                                    <p className="text-gray-500">Quantity</p>
                                    <p className="font-mono">{Number(item.balance).toFixed(6)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Avg. Buy Price</p>
                                    <p className="font-mono">€{Number(item.pmp).toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Current Price</p>
                                    <p className="font-mono">€{Number(item.current_price).toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Total Value</p>
                                    <p className="font-mono">€{Number(item.current_value).toFixed(2)}</p>
                                </div>
                            </div>

                            {/* Collapsible purchase history */}
                            <details className="mb-4">
                                <summary className="cursor-pointer text-gray-500 hover:text-gray-800">
                                    Purchase history ({item.transactions.length})
                                </summary>
                                <table className="w-full mt-2 border border-gray-100 text-xs">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left px-2 py-1 border-b">Date</th>
                                            <th className="text-right px-2 py-1 border-b">Quantity</th>
                                            <th className="text-right px-2 py-1 border-b">Price / unit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {item.transactions.map((tx, i) => (
                                            <tr key={i} className="border-b hover:bg-gray-50">
                                                <td className="px-2 py-1">{tx.date}</td>
                                                <td className="px-2 py-1 text-right font-mono">
                                                    {Number(tx.quantity).toFixed(6)}
                                                </td>
                                                <td className="px-2 py-1 text-right font-mono">
                                                    €{Number(tx.price).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </details>

                            {/* Sell form */}
                            {sellForm.coin === item.currency ? (
                                <form onSubmit={handleSell} className="flex flex-wrap items-center gap-2">
                                    <span className="text-gray-600">Sell quantity:</span>
                                    <input
                                        type="number"
                                        min="0.000001"
                                        step="0.000001"
                                        max={item.balance}
                                        value={sellForm.quantity}
                                        onChange={e => setSellForm(f => ({ ...f, quantity: e.target.value }))}
                                        className="border border-gray-300 rounded px-2 py-1 w-36"
                                        required
                                    />
                                    <button type="submit"
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                                        Confirm Sale
                                    </button>
                                    <button type="button"
                                        className="text-gray-500 hover:underline"
                                        onClick={() => setSellForm({ coin: null, quantity: '' })}>
                                        Cancel
                                    </button>
                                </form>
                            ) : (
                                <button
                                    className="text-red-600 hover:underline"
                                    onClick={() => setSellForm({ coin: item.currency, quantity: '' })}
                                >
                                    Sell {item.currency}
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Portfolio;
