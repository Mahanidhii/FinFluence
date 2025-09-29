import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Activity as FeedIcon, 
  Users, 
  Trophy, 
  TrendingUp,
  MessageCircle,
  PieChart,
  BarChart3,
  Newspaper,
  Bitcoin
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Feed', href: '/feed', icon: Home },
    { name: 'My Finance', href: '/dashboard', icon: PieChart },
    { name: 'Groups', href: '/groups', icon: Users },
    { name: 'Challenges', href: '/challenges', icon: Trophy },
    { name: 'Assistant', href: '/assistant', icon: MessageCircle },
    { name: 'Stock News', href: '/stock-news', icon: Newspaper },
    { name: 'Crypto News', href: '/crypto-news', icon: Bitcoin },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <TrendingUp className="h-8 w-8 text-primary-500" />
          <span className="ml-2 text-xl font-bold text-gray-900">FinFluence</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4">
            <h3 className="text-sm font-medium text-primary-800 mb-2">
              Quick Stats
            </h3>
            <div className="space-y-2 text-sm text-primary-700">
              <div className="flex justify-between">
                <span>Savings Streak</span>
                <span className="font-semibold">15 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
          <p>&copy; 2024 FinFluence. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;