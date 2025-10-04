import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ExternalLink, Clock, DollarSign, Newspaper } from 'lucide-react';

const StockNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock stock news data - In real app, this would come from an API like Alpha Vantage, Polygon, or News API
  const mockStockNews = [
    {
      id: 1,
      title: "Apple Reports Strong Q4 Earnings, Stock Surges 5%",
      summary: "Apple Inc. exceeded analyst expectations with quarterly revenue of $89.5 billion, driven by strong iPhone 15 sales and services growth.",
      source: "MarketWatch",
      publishedAt: "2025-09-28T08:30:00Z",
      url: "https://example.com/apple-earnings",
      category: "earnings",
      sentiment: "positive",
      ticker: "AAPL",
      priceChange: "+5.2%",
      image: "https://via.placeholder.com/300x200?text=Apple+Stock"
    },
    {
      id: 2,
      title: "Tesla Stock Drops 3% on Production Concerns",
      summary: "Tesla shares declined after reports of production delays at the company's Berlin factory, raising concerns about Q4 delivery targets.",
      source: "Reuters",
      publishedAt: "2025-09-28T07:45:00Z",
      url: "https://example.com/tesla-production",
      category: "production",
      sentiment: "negative",
      ticker: "TSLA",
      priceChange: "-3.1%",
      image: "https://via.placeholder.com/300x200?text=Tesla+Stock"
    },
    {
      id: 3,
      title: "Microsoft Azure Growth Drives Cloud Revenue Up 29%",
      summary: "Microsoft's cloud computing segment continues to show strong growth, with Azure revenue increasing 29% year-over-year in the latest quarter.",
      source: "CNBC",
      publishedAt: "2025-09-28T06:15:00Z",
      url: "https://example.com/microsoft-azure",
      category: "earnings",
      sentiment: "positive",
      ticker: "MSFT",
      priceChange: "+2.8%",
      image: "https://via.placeholder.com/300x200?text=Microsoft+Cloud"
    },
    {
      id: 4,
      title: "Fed Rate Decision Impact on Banking Stocks",
      summary: "Banking stocks rally as investors anticipate favorable conditions following the Federal Reserve's latest interest rate decision.",
      source: "Bloomberg",
      publishedAt: "2025-09-28T05:30:00Z",
      url: "https://example.com/fed-banking",
      category: "policy",
      sentiment: "positive",
      ticker: "XLF",
      priceChange: "+1.9%",
      image: "https://via.placeholder.com/300x200?text=Banking+Sector"
    },
    {
      id: 5,
      title: "Nvidia AI Chip Demand Continues to Surge",
      summary: "Nvidia's data center revenue reaches new highs as demand for AI chips remains strong across enterprise and cloud customers.",
      source: "The Wall Street Journal",
      publishedAt: "2025-09-28T04:00:00Z",
      url: "https://example.com/nvidia-ai",
      category: "technology",
      sentiment: "positive",
      ticker: "NVDA",
      priceChange: "+4.5%",
      image: "https://via.placeholder.com/300x200?text=Nvidia+AI"
    }
  ];

  const categories = [
    { id: 'all', name: 'All News' },
    { id: 'earnings', name: 'Earnings' },
    { id: 'technology', name: 'Technology' },
    { id: 'policy', name: 'Policy' },
    { id: 'production', name: 'Production' }
  ];

  useEffect(() => {
    // Simulate API loading
    setLoading(true);
    setTimeout(() => {
      setNews(mockStockNews);
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          {[...Array(5)].map((_, i) => (
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Stock Market News</h1>
        <p className="text-gray-600">Stay updated with the latest stock market developments</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
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
                        <DollarSign className="h-4 w-4 mr-1" />
                        {article.ticker}
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
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    article.category === 'earnings' ? 'bg-blue-100 text-blue-800' :
                    article.category === 'technology' ? 'bg-purple-100 text-purple-800' :
                    article.category === 'policy' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                  </span>
                  
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
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
            <Newspaper className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-gray-500">No news articles found for this category.</p>
        </div>
      )}
    </div>
  );
};

export default StockNews;