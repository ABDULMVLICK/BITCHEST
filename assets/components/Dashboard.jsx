import { useState, useEffect } from 'react';
import CryptoList from './CryptoList';
import Portfolio from './Portfolio';

/**
 * Main client dashboard.
 * Reads user metadata from the #root element's data-* attributes.
 */
const Dashboard = () => {
    const root = document.getElementById('root');
    const username   = root?.dataset.username   || '';
    const logoutUrl  = root?.dataset.logoutUrl  || '/logout';
    const profileUrl = root?.dataset.profileUrl || '/profile/edit';

    const [tab, setTab]           = useState('market');
    const [eurBalance, setEurBalance] = useState(null);

    useEffect(() => {
        fetch('/api/portfolio')
            .then(r => r.json())
            .then(d => setEurBalance(d.eur_balance))
            .catch(() => {});
    }, []);

    return (
        <div className="min-h-screen" style={{ background: '#f1f5f9' }}>

            {/* ── Navbar ── */}
            <nav style={{ background: '#38618C' }} className="text-white px-5 py-0 flex justify-between items-stretch shadow-lg">
                <div className="flex items-center gap-3 py-3">
                    <img src="/images/bitchest_logo.png" alt="BitChest" className="h-8 w-8 rounded-full" />
                    <span className="font-bold text-base tracking-wide">BitChest</span>
                </div>

                <div className="flex items-center gap-1">
                    {/* Balance badge */}
                    {eurBalance !== null && (
                        <div style={{ background: '#2d5278' }} className="rounded-lg px-3 py-1.5 mr-3">
                            <span style={{ color: '#35A7FF' }} className="text-xs mr-1">Balance</span>
                            <span className="font-mono font-semibold text-sm text-white">
                                €{Number(eurBalance).toFixed(2)}
                            </span>
                        </div>
                    )}

                    {/* Tab buttons inside nav */}
                    <button
                        onClick={() => setTab('market')}
                        style={tab === 'market'
                            ? { borderBottom: '3px solid #35A7FF', color: '#fff' }
                            : { borderBottom: '3px solid transparent', color: '#94a3b8' }
                        }
                        className="px-4 py-4 text-sm font-medium transition-colors hover:text-white"
                    >
                        Market
                    </button>
                    <button
                        onClick={() => setTab('portfolio')}
                        style={tab === 'portfolio'
                            ? { borderBottom: '3px solid #35A7FF', color: '#fff' }
                            : { borderBottom: '3px solid transparent', color: '#94a3b8' }
                        }
                        className="px-4 py-4 text-sm font-medium transition-colors hover:text-white"
                    >
                        Portfolio
                    </button>

                    <div className="ml-4 border-l border-slate-700 pl-4 flex items-center gap-3">
                        <a href={profileUrl}
                            className="text-slate-400 hover:text-white transition text-sm">
                            {username}
                        </a>
                        <a href={logoutUrl}
                            style={{ background: '#dc2626' }}
                            className="text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:opacity-90 transition">
                            Logout
                        </a>
                    </div>
                </div>
            </nav>

            {/* ── Content ── */}
            <div className="max-w-5xl mx-auto px-4 py-7 animate-fade-in">
                {tab === 'market'    && <CryptoList onBalanceChange={setEurBalance} />}
                {tab === 'portfolio' && <Portfolio  onBalanceChange={setEurBalance} />}
            </div>
        </div>
    );
};

export default Dashboard;
