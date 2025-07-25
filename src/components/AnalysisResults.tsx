import React from 'react';
import { Download, CheckCircle, XCircle, Clock, FolderTree, FileText, BookOpen, Workflow } from 'lucide-react';
import { AnalysisResult } from '../types';

interface Props {
  result: AnalysisResult;
}

const AnalysisResults: React.FC<Props> = ({ result }) => {
  const getStatusIcon = () => {
    switch (result.status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'processing':
        return <Clock className="h-6 w-6 text-yellow-500 animate-pulse" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (result.status) {
      case 'completed':
        return 'Analysis Completed Successfully';
      case 'error':
        return 'Analysis Failed';
      case 'processing':
        return 'Analysis in Progress...';
      default:
        return 'Unknown Status';
    }
  };

  const resultTypes = [
    {
      key: 'fileStructure',
      title: 'File Structure',
      icon: FolderTree,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      key: 'basicApiDocumentation',
      title: 'Basic API Documentation',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      key: 'advancedApiDocumentation',
      title: 'Advanced API Documentation',
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      key: 'flowChart',
      title: 'Flow Chart',
      icon: Workflow,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  const handleDownload = async (type: string, url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${type}.pdf`; // or appropriate extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getStatusIcon()}
            <h3 className="ml-3 text-lg font-medium text-gray-900">
              {getStatusText()}
            </h3>
          </div>
          <div className="text-sm text-gray-500">
            Analysis ID: {result.id}
          </div>
        </div>
      </div>

      <div className="p-6">
        {result.status === 'processing' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              Your codebase is being analyzed. This may take a few minutes...
            </p>
          </div>
        )}

        {result.status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <XCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-800">Analysis Error</h4>
                <p className="mt-1 text-sm text-red-700">
                  {result.error || 'An unexpected error occurred during analysis.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {result.status === 'completed' && result.results && (
          <div className="space-y-6">
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-2">Generated Results</h4>
              <p className="text-sm text-gray-600">
                Your analysis is complete! Download the generated documentation and charts below.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resultTypes.map((type) => {
                const hasResult = result.results?.[type.key as keyof typeof result.results];
                const downloadUrl = result.downloadUrls?.[type.key as keyof typeof result.downloadUrls];
                const Icon = type.icon;

                if (!hasResult) return null;

                return (
                  <div
                    key={type.key}
                    className={`border-2 rounded-lg p-4 ${type.borderColor} ${type.bgColor}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Icon className={`h-5 w-5 ${type.color} mr-2`} />
                        <h5 className="font-medium text-gray-900">{type.title}</h5>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      Generated successfully and ready for download.
                    </p>
                    
                    {downloadUrl ? (
                      <button
                        onClick={() => handleDownload(type.key, downloadUrl)}
                        className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors`}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download {type.title}
                      </button>
                    ) : (
                      <div className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-500">
                        Download link not available
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {Object.keys(result.results).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No results were generated. Please try again with different options.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;