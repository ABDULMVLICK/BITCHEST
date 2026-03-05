import { useState, useEffect } from 'react';

/** Maps coin names to their logo filenames in /images/ */
const COIN_IMAGES = {
    'Bitcoin':      '/images/bitcoin.png',
    'Ethereum':     '/images/ethereum.png',
    'Ripple':       '/images/ripple.png',
    'Bitcoin Cash': '/images/bitcoin-cash.png',
    'Cardano':      '/images/cardano.png',
    'Litecoin':     '/images/litecoin.png',
    'Dash':         '/images/dash.png',
    'Iota':         '/images/iota.png',
    'NEM':          '/images/nem.png',
    'Stellar':      '/images/stellar.png',
};

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

    if (!portfolio) {
        return (
            <div className="flex items-center gap-3 text-gray-500 py-10 justify-center">
                <span className="spinner" />
                Loading portfolio...
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* EUR balance banner */}
            <div className="bg-blue-900 text-white rounded-lg px-5 py-4 mb-5 flex justify-between items-center shadow">
                <div>
                    <p className="text-blue-300 text-xs uppercase tracking-widest mb-0.5">Available Balance</p>
                    <p className="text-2xl font-bold font-mono">€{Number(portfolio.eur_balance).toFixed(2)}</p>
                </div>
                <img src="/images/bitchest_logo.png" alt="" className="h-10 w-10 opacity-30" />
            </div>

            {msg && (
                <div className={`px-4 py-3 rounded-lg mb-4 border flex justify-between items-center animate-slide-down ${
                    msg.ok ? 'bg-green-50 border-green-300 text-green-800' : 'bg-red-50 border-red-300 text-red-800'
                }`}>
                    <span>{msg.text}</span>
                    <button className="ml-3 text-lg leading-none opacity-60 hover:opacity-100" onClick={() => setMsg(null)}>×</button>
                </div>
            )}

            {portfolio.portfolio.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <p className="text-4xl mb-3">📭</p>
                    <p>No holdings yet. Go to the <strong className="text-blue-700">Market</strong> tab to buy your first crypto.</p>
                </div>
            ) : (
                portfolio.portfolio.map(item => (
                    <div key={item.currency} className="border border-gray-200 rounded-lg mb-4 bg-white shadow-sm overflow-hidden">
                        {/* Coin header */}
                        <div className={`px-4 py-3 flex justify-between items-center ${
                            item.gain >= 0 ? 'bg-green-50 border-b border-green-100' : 'bg-red-50 border-b border-red-100'
                        }`}>
                            <div className="flex items-center gap-3">
                                {COIN_IMAGES[item.currency] && (
                                    <img src={COIN_IMAGES[item.currency]} alt={item.currency} className="w-8 h-8 rounded-full" />
                                )}
                                <span className="font-bold text-gray-800">{item.currency}</span>
                            </div>
                            <span className={`font-mono font-bold text-lg ${item.gain >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                                {item.gain >= 0 ? '▲ +' : '▼ '}€{Number(item.gain).toFixed(2)}
                            </span>
                        </div>

                        <div className="px-4 py-4">
                            {/* Summary grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                                <div className="bg-gray-50 rounded p-3">
                                    <p className="text-gray-400 text-xs uppercase mb-1">Quantity</p>
                                    <p className="font-mono font-semibold">{Number(item.balance).toFixed(6)}</p>
                                </div>
                                <div className="bg-gray-50 rounded p-3">
                                    <p className="text-gray-400 text-xs uppercase mb-1">Avg. Buy</p>
                                    <p className="font-mono font-semibold">€{Number(item.pmp).toFixed(2)}</p>
                                </div>
                                <div className="bg-gray-50 rounded p-3">
                                    <p className="text-gray-400 text-xs uppercase mb-1">Current Price</p>
                                    <p className="font-mono font-semibold text-blue-700">€{Number(item.current_price).toFixed(2)}</p>
                                </div>
                                <div className="bg-gray-50 rounded p-3">
                                    <p className="text-gray-400 text-xs uppercase mb-1">Total Value</p>
                                    <p className="font-mono font-semibold">€{Number(item.current_value).toFixed(2)}</p>
                                </div>
                            </div>

                            {/* Collapsible purchase history */}
                            <details className="mb-4 group">
                                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 transition list-none flex items-center gap-1">
                                    <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
                                    Purchase history ({item.transactions.length})
                                </summary>
                                <table className="w-full mt-2 border border-gray-100 text-xs rounded overflow-hidden">
                                    <thead className="bg-gray-100 text-gray-600">
                                        <tr>
                                            <th className="text-left px-3 py-1.5 border-b">Date</th>
                                            <th className="text-right px-3 py-1.5 border-b">Quantity</th>
                                            <th className="text-right px-3 py-1.5 border-b">Price / unit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {item.transactions.map((tx, i) => (
                                            <tr key={i} className="border-b hover:bg-gray-50 transition">
                                                <td className="px-3 py-1.5 text-gray-600">{tx.date}</td>
                                                <td className="px-3 py-1.5 text-right font-mono">
                                                    {Number(tx.quantity).toFixed(6)}
                                                </td>
                                                <td className="px-3 py-1.5 text-right font-mono">
                                                    €{Number(tx.price).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </details>

                            {/* Sell form */}
                            {sellForm.coin === item.currency ? (
                                <form onSubmit={handleSell} className="flex flex-wrap items-center gap-3 animate-slide-down">
                                    <span className="text-sm text-gray-600 font-medium">Sell quantity:</span>
                                    <input
                                        type="number"
                                        min="0.000001"
                                        step="0.000001"
                                        max={item.balance}
                                        value={sellForm.quantity}
                                        onChange={e => setSellForm(f => ({ ...f, quantity: e.target.value }))}
                                        className="border border-red-300 rounded px-2 py-1 w-36 text-sm"
                                        placeholder="0.000000"
                                        required
                                        autoFocus
                                    />
                                    <button type="submit"
                                        className="bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700 transition text-sm font-medium">
                                        Confirm Sale
                                    </button>
                                    <button type="button"
                                        className="text-gray-400 hover:text-gray-700 text-sm transition"
                                        onClick={() => setSellForm({ coin: null, quantity: '' })}>
                                        Cancel
                                    </button>
                                </form>
                            ) : (
                                <button
                                    className="border border-red-300 text-red-600 hover:bg-red-50 transition text-sm px-4 py-1.5 rounded font-medium"
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
