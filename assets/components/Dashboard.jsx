import React, { useState, useEffect } from 'react';
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
        <div className="min-h-screen bg-gray-50">
            {/* Navigation bar — EUR balance always visible */}
            <nav className="bg-white border-b border-gray-200 px-4 py-3 flex flex-wrap justify-between items-center gap-2">
                <span className="font-bold">BitChest</span>
                <div className="flex items-center gap-4">
                    {eurBalance !== null && (
                        <span className="font-mono font-medium">
                            Balance: €{Number(eurBalance).toFixed(2)}
                        </span>
                    )}
                    <a href={profileUrl} className="text-gray-600 hover:text-blue-600">
                        {username}
                    </a>
                    <a href={logoutUrl} className="text-red-600 hover:underline">Logout</a>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 py-6">
                {/* Tab navigation */}
                <div className="flex gap-4 border-b border-gray-200 mb-6">
                    <button
                        className={`pb-2 font-medium ${tab === 'market' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                        onClick={() => setTab('market')}
                    >
                        Market
                    </button>
                    <button
                        className={`pb-2 font-medium ${tab === 'portfolio' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                        onClick={() => setTab('portfolio')}
                    >
                        My Portfolio
                    </button>
                </div>

                {tab === 'market' && (
                    <CryptoList onBalanceChange={setEurBalance} />
                )}
                {tab === 'portfolio' && (
                    <Portfolio onBalanceChange={setEurBalance} />
                )}
            </div>
        </div>
    );
};

export default Dashboard;
