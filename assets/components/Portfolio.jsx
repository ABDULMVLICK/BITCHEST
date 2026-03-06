import { useState, useEffect } from 'react';

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
 * Displays the user's cryptocurrency portfolio with PMP, gains, sell form.
 */
const Portfolio = ({ onBalanceChange }) => {
    const [portfolio, setPortfolio] = useState(null);
    const [sellForm,  setSellForm]  = useState({ coin: null, quantity: '' });
    const [msg,       setMsg]       = useState(null);

    const loadPortfolio = () => {
        fetch('/api/portfolio').then(r => r.json()).then(setPortfolio).catch(() => {});
    };

    useEffect(loadPortfolio, []);

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
            <div className="flex items-center justify-center gap-3 py-20 text-slate-400">
                <span className="spinner" />
                Loading portfolio...
            </div>
        );
    }

    const totalValue = portfolio.portfolio.reduce((s, i) => s + Number(i.current_value), 0);
    const totalGain  = portfolio.portfolio.reduce((s, i) => s + Number(i.gain), 0);

    return (
        <div className="animate-fade-in">

            {/* ── Stats row ── */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="card card-accent p-4">
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">EUR Balance</p>
                    <p className="text-xl font-bold font-mono text-slate-800">
                        €{Number(portfolio.eur_balance).toFixed(2)}
                    </p>
                </div>
                <div className="card card-accent p-4">
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Portfolio Value</p>
                    <p className="text-xl font-bold font-mono text-slate-800">
                        €{totalValue.toFixed(2)}
                    </p>
                </div>
                <div className="card card-accent p-4">
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Total Gain</p>
                    <p className="text-xl font-bold font-mono" style={{ color: totalGain >= 0 ? '#01FF19' : '#dc2626' }}>
                        {totalGain >= 0 ? '+' : ''}€{totalGain.toFixed(2)}
                    </p>
                </div>
            </div>

            {msg && (
                <div className={`flex justify-between items-center px-4 py-3 rounded-lg mb-4 text-sm animate-slide-down ${
                    msg.ok ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                    {msg.text}
                    <button className="ml-3 opacity-50 hover:opacity-100 text-base" onClick={() => setMsg(null)}>×</button>
                </div>
            )}

            <h2 className="text-lg font-bold text-slate-800 mb-4">My Holdings</h2>

            {portfolio.portfolio.length === 0 ? (
                <div className="card p-12 text-center text-slate-400">
                    <p className="text-3xl mb-3">📭</p>
                    <p>No holdings yet. Go to <strong className="text-blue-700">Market</strong> to buy your first crypto.</p>
                </div>
            ) : (
                portfolio.portfolio.map(item => {
                    const isGain = Number(item.gain) >= 0;
                    return (
                        <div key={item.currency} className="card mb-4 overflow-hidden">
                            {/* Header */}
                            <div className="flex justify-between items-center px-5 py-3.5"
                                style={{
                                    background: isGain ? '#f0fdf4' : '#fff1f2',
                                    borderBottom: `1px solid ${isGain ? '#bbf7d0' : '#fecdd3'}`,
                                }}>
                                <div className="flex items-center gap-3">
                                    {COIN_IMAGES[item.currency] && (
                                        <img src={COIN_IMAGES[item.currency]} alt={item.currency}
                                            className="w-9 h-9 rounded-full shadow-sm" />
                                    )}
                                    <span className="font-bold text-slate-800">{item.currency}</span>
                                </div>
                                <span style={{ color: isGain ? '#01FF19' : '#dc2626' }}
                                    className="font-mono font-bold text-base">
                                    {isGain ? '▲ +' : '▼ '}€{Number(item.gain).toFixed(2)}
                                </span>
                            </div>

                            <div className="px-5 py-4">
                                {/* Stats grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                    {[
                                        { label: 'Quantity',      value: Number(item.balance).toFixed(6),       color: '' },
                                        { label: 'Avg. Buy Price', value: `€${Number(item.pmp).toFixed(2)}`,    color: '' },
                                        { label: 'Current Price', value: `€${Number(item.current_price).toFixed(2)}`, color: '#35A7FF' },
                                        { label: 'Total Value',   value: `€${Number(item.current_value).toFixed(2)}`, color: '' },
                                    ].map(stat => (
                                        <div key={stat.label}
                                            style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem' }}>
                                            <p className="text-xs text-slate-400 uppercase mb-1">{stat.label}</p>
                                            <p className="font-mono font-semibold text-sm"
                                                style={{ color: stat.color || '#1e293b' }}>
                                                {stat.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Purchase history */}
                                <details className="mb-4">
                                    <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700 transition select-none">
                                        ▶ Purchase history ({item.transactions.length} transactions)
                                    </summary>
                                    <table className="w-full mt-2 text-xs"
                                        style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', overflow: 'hidden' }}>
                                        <thead style={{ background: '#f1f5f9' }}>
                                            <tr>
                                                <th className="text-left px-3 py-2 text-slate-500">Date</th>
                                                <th className="text-right px-3 py-2 text-slate-500">Quantity</th>
                                                <th className="text-right px-3 py-2 text-slate-500">Price / unit</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {item.transactions.map((tx, i) => (
                                                <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}
                                                    className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-3 py-1.5 text-slate-600">{tx.date}</td>
                                                    <td className="px-3 py-1.5 text-right font-mono">{Number(tx.quantity).toFixed(6)}</td>
                                                    <td className="px-3 py-1.5 text-right font-mono">€{Number(tx.price).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </details>

                                {/* Sell form */}
                                {sellForm.coin === item.currency ? (
                                    <form onSubmit={handleSell} className="flex flex-wrap items-center gap-3 animate-slide-down">
                                        <span className="text-sm font-medium text-slate-600">Sell quantity:</span>
                                        <div className="flex items-center border border-red-300 rounded-lg overflow-hidden bg-white">
                                            <input
                                                type="number" min="0.000001" step="0.000001" max={item.balance}
                                                value={sellForm.quantity}
                                                onChange={e => setSellForm(f => ({ ...f, quantity: e.target.value }))}
                                                className="px-3 py-1.5 w-36 text-sm focus:outline-none"
                                                placeholder="0.000000" required autoFocus
                                            />
                                        </div>
                                        <button type="submit" className="btn-danger text-sm px-4 py-1.5">
                                            Confirm Sale
                                        </button>
                                        <button type="button"
                                            onClick={() => setSellForm({ coin: null, quantity: '' })}
                                            className="text-slate-400 hover:text-slate-600 text-sm transition">
                                            Cancel
                                        </button>
                                    </form>
                                ) : (
                                    <button
                                        onClick={() => setSellForm({ coin: item.currency, quantity: '' })}
                                        style={{ border: '1px solid #fca5a5', color: '#dc2626', background: 'transparent', borderRadius: '0.5rem', padding: '0.375rem 1rem' }}
                                        className="text-sm font-medium hover:bg-red-50 transition">
                                        Sell {item.currency}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default Portfolio;
