import React from 'react';
import { Code } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Code className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Codebase Analyzer</h1>
              <p className="text-sm text-gray-500">Python Documentation Generator</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md px-3 py-1">
              <p className="text-sm text-yellow-800">
                <span className="font-medium">Currently supports:</span> Python only
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;