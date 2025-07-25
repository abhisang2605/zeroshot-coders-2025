import React, { useState } from 'react';
import { CodebaseInput, AnalysisOptions, AnalysisResult, ValidationError } from './types';
import CodebaseUploader from './components/CodebaseUploader';
import OptionsSelector from './components/OptionsSelector';
import AnalysisResults from './components/AnalysisResults';
import Header from './components/Header';
import { analyzeCodebase } from './services/api';

function App() {
  const [input, setInput] = useState<CodebaseInput>({
    type: 'file',
    options: {
      fileStructure: false,
      basicApiDocumentation: false,
      advancedApiDocumentation: false,
      flowChart: false,
    }
  });
  
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validateInput = (): ValidationError[] => {
    const validationErrors: ValidationError[] = [];

    // Check if at least one option is selected
    const hasSelectedOption = Object.values(input.options).some(option => option);
    if (!hasSelectedOption) {
      validationErrors.push({
        field: 'options',
        message: 'Please select at least one analysis option'
      });
    }

    // Check input source
    if (input.type === 'file' && !input.file) {
      validationErrors.push({
        field: 'file',
        message: 'Please upload a ZIP file'
      });
    }

    if ((input.type === 'github' || input.type === 'azure') && !input.url) {
      validationErrors.push({
        field: 'url',
        message: 'Please provide a repository URL'
      });
    }

    return validationErrors;
  };

  const handleAnalyze = async () => {
    const validationErrors = validateInput();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setIsLoading(true);
    setResult(null);

    try {
      const analysisResult = await analyzeCodebase(input);
      setResult(analysisResult);
    } catch (error) {
      setResult({
        id: Date.now().toString(),
        status: 'error',
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInput({
      type: 'file',
      options: {
        fileStructure: false,
        basicApiDocumentation: false,
        advancedApiDocumentation: false,
        flowChart: false,
      }
    });
    setResult(null);
    setErrors([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Analyze Your Python Codebase
              </h2>
              <p className="text-gray-600">
                Upload your Python codebase and generate comprehensive documentation, 
                API references, and flowcharts automatically.
              </p>
            </div>

            {/* Error Display */}
            {errors.length > 0 && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Please fix the following errors:
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {errors.map((error, index) => (
                          <li key={index}>{error.message}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Codebase Input Section */}
            <div className="mb-8">
              <CodebaseUploader input={input} onChange={setInput} />
            </div>

            {/* Options Selection */}
            <div className="mb-8">
              <OptionsSelector 
                options={input.options} 
                onChange={(options) => setInput({ ...input, options })} 
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </div>
                ) : (
                  'Analyze Codebase'
                )}
              </button>
              
              <button
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="mt-8">
            <AnalysisResults result={result} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;