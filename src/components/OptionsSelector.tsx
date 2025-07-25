import React from 'react';
import { FolderTree, FileText, BookOpen, Workflow } from 'lucide-react';
import { AnalysisOptions } from '../types';

interface Props {
  options: AnalysisOptions;
  onChange: (options: AnalysisOptions) => void;
}

const OptionsSelector: React.FC<Props> = ({ options, onChange }) => {
  const handleOptionChange = (option: keyof AnalysisOptions, value: boolean) => {
    onChange({
      ...options,
      [option]: value
    });
  };

  const optionsList = [
    {
      key: 'fileStructure' as keyof AnalysisOptions,
      title: 'File Structure',
      description: 'Generate a comprehensive directory tree and file organization overview',
      icon: FolderTree,
      color: 'text-blue-600'
    },
    {
      key: 'basicApiDocumentation' as keyof AnalysisOptions,
      title: 'Basic API Documentation',
      description: 'Create simple documentation for classes, functions, and modules',
      icon: FileText,
      color: 'text-green-600'
    },
    {
      key: 'advancedApiDocumentation' as keyof AnalysisOptions,
      title: 'Advanced API Documentation',
      description: 'Generate detailed documentation with examples, parameters, and return values',
      icon: BookOpen,
      color: 'text-purple-600'
    },
    {
      key: 'flowChart' as keyof AnalysisOptions,
      title: 'Flow Chart',
      description: 'Create visual flowcharts showing code execution paths and relationships',
      icon: Workflow,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Select Analysis Options</h3>
      <p className="text-sm text-gray-600 mb-6">
        Choose what you want to generate from your codebase. You can select multiple options.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {optionsList.map((option) => {
          const Icon = option.icon;
          const isSelected = options[option.key];
          
          return (
            <div
              key={option.key}
              className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => handleOptionChange(option.key, !isSelected)}
            >
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleOptionChange(option.key, e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center mb-2">
                    <Icon className={`h-5 w-5 ${option.color} mr-2`} />
                    <h4 className="text-sm font-medium text-gray-900">
                      {option.title}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    {option.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {!Object.values(options).some(option => option) && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            Please select at least one analysis option to proceed.
          </p>
        </div>
      )}
    </div>
  );
};

export default OptionsSelector;