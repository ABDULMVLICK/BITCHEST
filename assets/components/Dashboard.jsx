import { useState, useEffect } from 'react';
import CryptoList from './CryptoList';
import Portfolio from './Portfolio';

/**
 * Main client dashboard.
 *
 * Reads user metadata from the #root element's data-* attributes
 * so the Twig template can pass server-side values without an extra API call.
 */
const Dashboard = () => {
    const root = document.getElementById('root');
    const username   = root?.dataset.username   || '';
    const logoutUrl  = root?.dataset.logoutUrl  || '/logout';
    const profileUrl = root?.dataset.profileUrl || '/profile/edit';

    const [tab, setTab] = useState('market');
    const [eurBalance, setEurBalance] = useState(null);

    // Load EUR balance once on mount
    useEffect(() => {
        fetch('/api/portfolio')
            .then(r => r.json())
            .then(d => setEurBalance(d.eur_balance))
            .catch(() => {});
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 animate-fade-in">
            {/* Navigation bar — dark navy with logo */}
            <nav className="bg-blue-900 text-white px-4 py-3 flex flex-wrap justify-between items-center gap-2 shadow-md">
                <div className="flex items-center gap-3">
                    <img src="/images/bitchest_logo.png" alt="BitChest" className="h-8 w-8 rounded" />
                    <span className="font-bold text-lg tracking-wide">BitChest</span>
                </div>
                <div className="flex items-center gap-5">
                    {eurBalance !== null && (
                        <span className="font-mono text-blue-100 text-sm">
                            <span className="text-blue-300 mr-1">Balance</span>
                            €{Number(eurBalance).toFixed(2)}
                        </span>
                    )}
                    <a href={profileUrl} className="text-blue-200 hover:text-white transition text-sm">
                        {username}
                    </a>
                    <a href={logoutUrl} className="bg-red-600 hover:bg-red-700 transition text-white text-sm px-3 py-1 rounded">
                        Logout
                    </a>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 py-6">
                {/* Tab navigation */}
                <div className="flex gap-1 mb-6 bg-white border border-gray-200 rounded-lg p-1 w-fit shadow-sm">
                    <button
                        className={`px-5 py-2 rounded-md font-medium text-sm transition ${
                            tab === 'market'
                                ? 'bg-blue-700 text-white shadow'
                                : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                        }`}
                        onClick={() => setTab('market')}
                    >
                        Market
                    </button>
                    <button
                        className={`px-5 py-2 rounded-md font-medium text-sm transition ${
                            tab === 'portfolio'
                                ? 'bg-blue-700 text-white shadow'
                                : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                        }`}
                        onClick={() => setTab('portfolio')}
                    >
                        My Portfolio
                    </button>
                </div>

                <div className="animate-fade-in">
                    {tab === 'market' && (
                        <CryptoList onBalanceChange={setEurBalance} />
                    )}
                    {tab === 'portfolio' && (
                        <Portfolio onBalanceChange={setEurBalance} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
