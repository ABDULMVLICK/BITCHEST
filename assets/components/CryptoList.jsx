import React, { useState, useEffect } from 'react';
import CryptoChart from './CryptoChart';

/**
 * Displays current prices for all 10 supported cryptocurrencies.
 *
 * Features:
 * - Expandable 30-day price chart per coin
 * - Inline buy form (amount in EUR)
 *
 * @param {Function} onBalanceChange - Called with new EUR balance after a purchase
 */
const CryptoList = ({ onBalanceChange }) => {
    const [prices,       setPrices]       = useState({});
    const [history,      setHistory]      = useState({});
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [buyForm,      setBuyForm]      = useState({ coin: null, amount: '' });
    const [msg,          setMsg]          = useState(null);
    const [loading,      setLoading]      = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/prices').then(r => r.json()),
            fetch('/api/history').then(r => r.json()),
        ]).then(([p, h]) => {
            setPrices(p);
            setHistory(h);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    /** Submits a buy order for the selected coin. */
    const handleBuy = async (e) => {
        e.preventDefault();
        const res  = await fetch('/api/buy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ coin: buyForm.coin, amount: parseFloat(buyForm.amount) }),
        });
        const data = await res.json();

        if (res.ok) {
            setMsg({ ok: true, text: `Bought ${buyForm.coin}. Balance: €${Number(data.eur_balance).toFixed(2)}` });
            onBalanceChange?.(data.eur_balance);
            setBuyForm({ coin: null, amount: '' });
        } else {
            setMsg({ ok: false, text: data.error || 'Purchase failed.' });
        }
    };

    if (loading) return <p className="text-gray-500">Loading market data...</p>;

    return (
        <div>
            {msg && (
                <p className={`px-3 py-2 rounded mb-4 border ${msg.ok ? 'bg-green-50 border-green-300 text-green-700' : 'bg-red-50 border-red-300 text-red-700'}`}>
                    {msg.text}
                    <button className="ml-2 underline" onClick={() => setMsg(null)}>×</button>
                </p>
            )}

            <div className="overflow-x-auto">
                <table className="w-full border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-3 py-2 border-b">Cryptocurrency</th>
                            <th className="text-right px-3 py-2 border-b">Price (EUR)</th>
                            <th className="text-center px-3 py-2 border-b">Chart</th>
                            <th className="text-center px-3 py-2 border-b">Buy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(prices).map(([coin, price]) => (
                            <React.Fragment key={coin}>
                                <tr className="border-b hover:bg-gray-50">
                                    <td className="px-3 py-2 font-medium">{coin}</td>
                                    <td className="px-3 py-2 text-right font-mono">
                                        €{Number(price).toFixed(2)}
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        <button
                                            className="text-blue-600 hover:underline"
                                            onClick={() => setSelectedCoin(selectedCoin === coin ? null : coin)}
                                        >
                                            {selectedCoin === coin ? 'Hide' : 'Chart'}
                                        </button>
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        <button
                                            className="text-blue-600 hover:underline"
                                            onClick={() => setBuyForm({ coin, amount: '' })}
                                        >
                                            Buy
                                        </button>
                                    </td>
                                </tr>

                                {/* Expandable chart row */}
                                {selectedCoin === coin && history[coin] && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-4 bg-gray-50 border-b">
                                            <p className="font-medium mb-2">{coin} — 30-day price (EUR)</p>
                                            <CryptoChart coin={coin} history={history[coin]} />
                                        </td>
                                    </tr>
                                )}

                                {/* Inline buy form row */}
                                {buyForm.coin === coin && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-3 bg-blue-50 border-b">
                                            <form onSubmit={handleBuy} className="flex flex-wrap items-center gap-2">
                                                <span>Buy {coin} for</span>
                                                <span>€</span>
                                                <input
                                                    type="number"
                                                    min="0.01"
                                                    step="0.01"
                                                    value={buyForm.amount}
                                                    onChange={e => setBuyForm(f => ({ ...f, amount: e.target.value }))}
                                                    className="border border-gray-300 rounded px-2 py-1 w-28"
                                                    required
                                                />
                                                <button type="submit"
                                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                                                    Confirm
                                                </button>
                                                <button type="button"
                                                    className="text-gray-500 hover:underline"
                                                    onClick={() => setBuyForm({ coin: null, amount: '' })}>
                                                    Cancel
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CryptoList;
