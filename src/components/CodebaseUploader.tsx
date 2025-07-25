import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Github, GitBranch, File, AlertCircle } from 'lucide-react';
import { CodebaseInput } from '../types';
import clsx from 'clsx';

interface Props {
  input: CodebaseInput;
  onChange: (input: CodebaseInput) => void;
}

const CodebaseUploader: React.FC<Props> = ({ input, onChange }) => {
  const [dragActive, setDragActive] = useState(false);
  const [languageError, setLanguageError] = useState<string | null>(null);

  const validatePythonCodebase = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        // Simple check for Python files - look for .py extensions or Python syntax
        const hasPythonFiles = content.includes('.py') || 
                              content.includes('def ') || 
                              content.includes('import ') ||
                              content.includes('from ') ||
                              content.includes('class ');
        resolve(hasPythonFiles);
      };
      reader.readAsText(file.slice(0, 1000)); // Read first 1KB to check
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setLanguageError(null);
    const file = acceptedFiles[0];
    
    if (file && file.type === 'application/zip') {
      // Validate if it's a Python codebase
      const isPython = await validatePythonCodebase(file);
      if (!isPython) {
        setLanguageError('This appears to be a non-Python codebase. Currently, only Python codebases are supported.');
        return;
      }
      
      onChange({
        ...input,
        file,
        type: 'file'
      });
    }
  }, [input, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip']
    },
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const handleUrlChange = (url: string) => {
    setLanguageError(null);
    onChange({
      ...input,
      url,
      file: undefined
    });
  };

  const handleTypeChange = (type: 'file' | 'github' | 'azure') => {
    setLanguageError(null);
    onChange({
      ...input,
      type,
      file: undefined,
      url: ''
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Input Method</h3>
        
        {/* Input Type Selector */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => handleTypeChange('file')}
            className={clsx(
              'flex items-center px-4 py-2 rounded-md border font-medium transition-colors',
              input.type === 'file'
                ? 'bg-primary-50 border-primary-200 text-primary-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            )}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload ZIP
          </button>
          <button
            onClick={() => handleTypeChange('github')}
            className={clsx(
              'flex items-center px-4 py-2 rounded-md border font-medium transition-colors',
              input.type === 'github'
                ? 'bg-primary-50 border-primary-200 text-primary-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            )}
          >
            <Github className="h-4 w-4 mr-2" />
            GitHub
          </button>
          <button
            onClick={() => handleTypeChange('azure')}
            className={clsx(
              'flex items-center px-4 py-2 rounded-md border font-medium transition-colors',
              input.type === 'azure'
                ? 'bg-primary-50 border-primary-200 text-primary-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            )}
          >
            <GitBranch className="h-4 w-4 mr-2" />
            Azure DevOps
          </button>
        </div>

        {/* Language Error */}
        {languageError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
              <p className="text-sm text-red-700">{languageError}</p>
            </div>
          </div>
        )}

        {/* File Upload */}
        {input.type === 'file' && (
          <div
            {...getRootProps()}
            className={clsx(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
              isDragActive || dragActive
                ? 'border-primary-400 bg-primary-50'
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              {input.file ? (
                <div className="flex items-center text-sm text-gray-600">
                  <File className="h-4 w-4 mr-2" />
                  {input.file.name}
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop your ZIP file here or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Only ZIP files containing Python codebases are supported
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Repository URL Input */}
        {(input.type === 'github' || input.type === 'azure') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repository URL
            </label>
            <input
              type="url"
              value={input.url || ''}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={
                input.type === 'github'
                  ? 'https://github.com/username/repository'
                  : 'https://dev.azure.com/organization/project/_git/repository'
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Make sure the repository contains Python code and is publicly accessible
            </p>
          </div>
        )}
      </div>

      {/* Additional Inputs */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Prompt (Optional)
          </label>
          <textarea
            value={input.additionalPrompt || ''}
            onChange={(e) => onChange({ ...input, additionalPrompt: e.target.value })}
            rows={3}
            placeholder="Provide any specific instructions or context for the analysis..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Codebase Summary (Optional)
          </label>
          <textarea
            value={input.summary || ''}
            onChange={(e) => onChange({ ...input, summary: e.target.value })}
            rows={3}
            placeholder="Briefly describe what your codebase does, its main purpose, and key features..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>
    </div>
  );
};

export default CodebaseUploader;