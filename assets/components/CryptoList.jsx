import { useState, useEffect, Fragment } from 'react';
import CryptoChart from './CryptoChart';

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
 * Features: expandable chart, inline buy form.
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

    const handleBuy = async (e) => {
        e.preventDefault();
        const res  = await fetch('/api/buy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ coin: buyForm.coin, amount: parseFloat(buyForm.amount) }),
        });
        const data = await res.json();
        if (res.ok) {
            setMsg({ ok: true, text: `Bought ${buyForm.coin}. New balance: €${Number(data.eur_balance).toFixed(2)}` });
            onBalanceChange?.(data.eur_balance);
            setBuyForm({ coin: null, amount: '' });
        } else {
            setMsg({ ok: false, text: data.error || 'Purchase failed.' });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center gap-3 py-20 text-slate-400">
                <span className="spinner" />
                Loading market data...
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">Crypto Market</h2>

            {msg && (
                <div className={`flex justify-between items-center px-4 py-3 rounded-lg mb-4 text-sm animate-slide-down ${
                    msg.ok
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                    {msg.text}
                    <button className="ml-3 opacity-50 hover:opacity-100 text-base" onClick={() => setMsg(null)}>×</button>
                </div>
            )}

            <div className="card overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr style={{ background: '#38618C', color: '#fff' }} className="text-xs uppercase tracking-wider">
                            <th className="text-left px-5 py-3 w-8">#</th>
                            <th className="text-left px-5 py-3">Asset</th>
                            <th className="text-right px-5 py-3">Price (EUR)</th>
                            <th className="text-center px-5 py-3">Chart</th>
                            <th className="text-center px-5 py-3">Trade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(prices).map(([coin, price], index) => (
                            <Fragment key={coin}>
                                {/* ── Coin row ── */}
                                <tr
                                    style={{ borderBottom: '1px solid #f1f5f9' }}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-5 py-3.5 text-slate-400 text-xs">{index + 1}</td>

                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            {COIN_IMAGES[coin] && (
                                                <img src={COIN_IMAGES[coin]} alt={coin}
                                                    className="w-8 h-8 rounded-full shadow-sm" />
                                            )}
                                            <span className="font-semibold text-slate-800 text-sm">{coin}</span>
                                        </div>
                                    </td>

                                    <td className="px-5 py-3.5 text-right">
                                        <span className="font-mono font-bold text-slate-800">
                                            €{Number(price).toFixed(2)}
                                        </span>
                                    </td>

                                    <td className="px-5 py-3.5 text-center">
                                        <button
                                            onClick={() => setSelectedCoin(selectedCoin === coin ? null : coin)}
                                            style={selectedCoin === coin
                                                ? { background: '#35A7FF', color: '#fff', border: 'none' }
                                                : { background: 'transparent', color: '#35A7FF', border: '1px solid #35A7FF' }
                                            }
                                            className="text-xs px-3 py-1 rounded-full transition"
                                        >
                                            {selectedCoin === coin ? 'Hide ▲' : 'Chart ▼'}
                                        </button>
                                    </td>

                                    <td className="px-5 py-3.5 text-center">
                                        <button
                                            onClick={() => setBuyForm(f => f.coin === coin ? { coin: null, amount: '' } : { coin, amount: '' })}
                                            className="btn-buy"
                                        >
                                            Buy
                                        </button>
                                    </td>
                                </tr>

                                {/* ── Chart row ── */}
                                {selectedCoin === coin && history[coin] && (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-4 animate-slide-down"
                                            style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                            <p className="text-xs font-semibold text-slate-500 uppercase mb-3">
                                                {coin} — 30-day price history
                                            </p>
                                            <CryptoChart coin={coin} history={history[coin]} />
                                        </td>
                                    </tr>
                                )}

                                {/* ── Buy form row ── */}
                                {buyForm.coin === coin && (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-3 animate-slide-down"
                                            style={{ background: 'rgba(53,167,255,0.07)', borderBottom: '1px solid rgba(53,167,255,0.2)' }}>
                                            <form onSubmit={handleBuy} className="flex flex-wrap items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    {COIN_IMAGES[coin] && (
                                                        <img src={COIN_IMAGES[coin]} alt={coin} className="w-5 h-5" />
                                                    )}
                                                    <span className="font-semibold text-blue-900 text-sm">Buy {coin}</span>
                                                </div>
                                                <div className="flex items-center border border-blue-300 rounded-lg overflow-hidden bg-white">
                                                    <span className="px-2 text-slate-400 text-sm">€</span>
                                                    <input
                                                        type="number" min="0.01" step="0.01"
                                                        value={buyForm.amount}
                                                        onChange={e => setBuyForm(f => ({ ...f, amount: e.target.value }))}
                                                        className="px-2 py-1.5 w-28 text-sm focus:outline-none"
                                                        placeholder="Amount"
                                                        required autoFocus
                                                    />
                                                </div>
                                                <button type="submit" className="btn-primary text-sm px-4 py-1.5">
                                                    Confirm
                                                </button>
                                                <button type="button"
                                                    onClick={() => setBuyForm({ coin: null, amount: '' })}
                                                    className="text-slate-400 hover:text-slate-600 text-sm transition">
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
