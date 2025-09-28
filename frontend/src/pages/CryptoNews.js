import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ExternalLink, Clock, Bitcoin, DollarSign } from 'lucide-react';

const CryptoNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock crypto news data - In real app, this would come from CoinGecko, CryptoCompare, or CoinDesk API
  const mockCryptoNews = [
    {
      id: 1,
      title: "Bitcoin Reaches New All-Time High Above $68,000",
      summary: "Bitcoin surged to a new record high driven by institutional adoption and spot ETF approvals, with analysts predicting further gains ahead.",
      source: "CoinDesk",
      publishedAt: "2025-09-28T09:15:00Z",
      url: "https://example.com/bitcoin-ath",
      category: "market",
      sentiment: "positive",
      coin: "BTC",
      priceChange: "+8.5%",
      price: "$68,250",
      image: "https://via.placeholder.com/300x200?text=Bitcoin+ATH"
    },
    {
      id: 2,
      title: "Ethereum 2.0 Staking Rewards Hit Record Levels",
      summary: "Ethereum's proof-of-stake mechanism shows robust participation with over 25 million ETH staked, generating attractive yields for validators.",
      source: "Decrypt",
      publishedAt: "2025-09-28T08:45:00Z",
      url: "https://example.com/ethereum-staking",
      category: "technology",
      sentiment: "positive",
      coin: "ETH",
      priceChange: "+5.2%",
      price: "$2,850",
      image: "https://via.placeholder.com/300x200?text=Ethereum+Staking"
    },
    {
      id: 3,
      title: "Regulatory Clarity Boosts Altcoin Market Sentiment",
      summary: "Recent regulatory announcements provide clearer guidelines for cryptocurrency operations, leading to increased investor confidence in altcoins.",
      source: "CoinTelegraph",
      publishedAt: "2025-09-28T07:30:00Z",
      url: "https://example.com/altcoin-regulation",
      category: "regulation",
      sentiment: "positive",
      coin: "ALT",
      priceChange: "+12.3%",
      price: "Mixed",
      image: "https://via.placeholder.com/300x200?text=Altcoin+Rally"
    },
    {
      id: 4,
      title: "Solana Network Experiences Brief Outage, SOL Drops",
      summary: "The Solana blockchain faced a 4-hour network disruption affecting DeFi protocols and NFT marketplaces, causing SOL to decline temporarily.",
      source: "The Block",
      publishedAt: "2025-09-28T06:00:00Z",
      url: "https://example.com/solana-outage",
      category: "technology",
      sentiment: "negative",
      coin: "SOL",
      priceChange: "-6.8%",
      price: "$145",
      image: "https://via.placeholder.com/300x200?text=Solana+Outage"
    },
    {
      id: 5,
      title: "Major Bank Announces Crypto Custody Services",
      summary: "JPMorgan Chase reveals plans to offer cryptocurrency custody services to institutional clients, marking another step in mainstream adoption.",
      source: "Bloomberg Crypto",
      publishedAt: "2025-09-28T05:15:00Z",
      url: "https://example.com/jpmorgan-custody",
      category: "adoption",
      sentiment: "positive",
      coin: "BTC",
      priceChange: "+2.1%",
      price: "$68,250",
      image: "https://via.placeholder.com/300x200?text=Bank+Crypto"
    },
    {
      id: 6,
      title: "DeFi Protocol Suffers $50M Exploit, Security Concerns Rise",
      summary: "A popular DeFi lending protocol was exploited for $50 million due to a smart contract vulnerability, highlighting ongoing security risks in DeFi.",
      source: "DeFi Pulse",
      publishedAt: "2025-09-28T04:30:00Z",
      url: "https://example.com/defi-exploit",
      category: "security",
      sentiment: "negative",
      coin: "DeFi",
      priceChange: "-15.2%",
      price: "Various",
      image: "https://via.placeholder.com/300x200?text=DeFi+Security"
    }
  ];

  const categories = [
    { id: 'all', name: 'All News' },
    { id: 'market', name: 'Market' },
    { id: 'technology', name: 'Technology' },
    { id: 'regulation', name: 'Regulation' },
    { id: 'adoption', name: 'Adoption' },
    { id: 'security', name: 'Security' }
  ];

  useEffect(() => {
    // Simulate API loading
    setLoading(true);
    setTimeout(() => {
      setNews(mockCryptoNews);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSentimentIcon = (sentiment) => {
    return sentiment === 'positive' ? TrendingUp : TrendingDown;
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'market': return 'bg-blue-100 text-blue-800';
      case 'technology': return 'bg-purple-100 text-purple-800';
      case 'regulation': return 'bg-orange-100 text-orange-800';
      case 'adoption': return 'bg-green-100 text-green-800';
      case 'security': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 mb-4 shadow">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Bitcoin className="h-8 w-8 mr-3 text-orange-500" />
          Cryptocurrency News
        </h1>
        <p className="text-gray-600">Latest updates from the crypto world</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Top Crypto Prices Bar */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Market Overview</h3>
          <span className="text-sm text-gray-500">Live prices</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-600">Bitcoin</div>
            <div className="font-bold text-lg">$68,250</div>
            <div className="text-green-600 text-sm">+8.5%</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Ethereum</div>
            <div className="font-bold text-lg">$2,850</div>
            <div className="text-green-600 text-sm">+5.2%</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Solana</div>
            <div className="font-bold text-lg">$145</div>
            <div className="text-red-600 text-sm">-6.8%</div>
          </div>
        </div>
      </div>

      {/* News List */}
      <div className="space-y-4">
        {filteredNews.map((article) => {
          const SentimentIcon = getSentimentIcon(article.sentiment);
          return (
            <div key={article.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTime(article.publishedAt)}
                      </span>
                      <span>{article.source}</span>
                      <span className="flex items-center">
                        <Bitcoin className="h-4 w-4 mr-1" />
                        {article.coin}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {article.price}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(article.sentiment)}`}>
                      <SentimentIcon className="h-3 w-3 inline mr-1" />
                      {article.priceChange}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{article.summary}</p>
                
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                    {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                  </span>
                  
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-orange-600 hover:text-orange-800 text-sm font-medium"
                  >
                    Read more
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <Bitcoin className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-gray-500">No crypto news found for this category.</p>
        </div>
      )}
    </div>
  );
};

export default CryptoNews;