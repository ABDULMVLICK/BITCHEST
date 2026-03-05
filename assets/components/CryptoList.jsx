import { useState, useEffect, Fragment } from 'react';
import CryptoChart from './CryptoChart';

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

    if (loading) {
        return (
            <div className="flex items-center gap-3 text-gray-500 py-10 justify-center">
                <span className="spinner" />
                Loading market data...
            </div>
        );
    }

    return (
        <div>
            {msg && (
                <div className={`px-4 py-3 rounded-lg mb-4 border flex justify-between items-center animate-slide-down ${
                    msg.ok ? 'bg-green-50 border-green-300 text-green-800' : 'bg-red-50 border-red-300 text-red-800'
                }`}>
                    <span>{msg.text}</span>
                    <button className="ml-3 text-lg leading-none opacity-60 hover:opacity-100" onClick={() => setMsg(null)}>×</button>
                </div>
            )}

            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="w-full bg-white">
                    <thead>
                        <tr className="bg-blue-900 text-white text-sm">
                            <th className="text-left px-4 py-3">#</th>
                            <th className="text-left px-4 py-3">Cryptocurrency</th>
                            <th className="text-right px-4 py-3">Price (EUR)</th>
                            <th className="text-center px-4 py-3">Chart</th>
                            <th className="text-center px-4 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(prices).map(([coin, price], index) => (
                            <Fragment key={coin}>
                                <tr className="border-b border-gray-100 hover:bg-blue-50 transition">
                                    <td className="px-4 py-3 text-gray-400 text-sm">{index + 1}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {COIN_IMAGES[coin] && (
                                                <img src={COIN_IMAGES[coin]} alt={coin} className="w-7 h-7 rounded-full" />
                                            )}
                                            <span className="font-medium">{coin}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono font-semibold text-blue-900">
                                        €{Number(price).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            className="text-xs border border-blue-300 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 transition"
                                            onClick={() => setSelectedCoin(selectedCoin === coin ? null : coin)}
                                        >
                                            {selectedCoin === coin ? 'Hide' : 'Chart'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded transition"
                                            onClick={() => setBuyForm({ coin, amount: '' })}
                                        >
                                            Buy
                                        </button>
                                    </td>
                                </tr>

                                {/* Expandable chart row */}
                                {selectedCoin === coin && history[coin] && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-4 bg-gray-50 border-b border-gray-100">
                                            <p className="font-medium mb-3 text-gray-700">{coin} — 30-day price (EUR)</p>
                                            <div className="animate-slide-down">
                                                <CryptoChart coin={coin} history={history[coin]} />
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {/* Inline buy form row */}
                                {buyForm.coin === coin && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-3 bg-blue-50 border-b border-blue-100">
                                            <form onSubmit={handleBuy} className="flex flex-wrap items-center gap-3 animate-slide-down">
                                                <div className="flex items-center gap-2">
                                                    {COIN_IMAGES[coin] && (
                                                        <img src={COIN_IMAGES[coin]} alt={coin} className="w-5 h-5" />
                                                    )}
                                                    <span className="font-medium text-blue-900">Buy {coin}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-gray-500">€</span>
                                                    <input
                                                        type="number"
                                                        min="0.01"
                                                        step="0.01"
                                                        value={buyForm.amount}
                                                        onChange={e => setBuyForm(f => ({ ...f, amount: e.target.value }))}
                                                        className="border border-blue-300 rounded px-2 py-1 w-28 text-sm"
                                                        placeholder="Amount"
                                                        required
                                                        autoFocus
                                                    />
                                                </div>
                                                <button type="submit"
                                                    className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition text-sm font-medium">
                                                    Confirm
                                                </button>
                                                <button type="button"
                                                    className="text-gray-500 hover:text-gray-800 text-sm transition"
                                                    onClick={() => setBuyForm({ coin: null, amount: '' })}>
                                                    Cancel
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CryptoList;
