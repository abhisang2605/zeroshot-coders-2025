export interface AnalysisOptions {
  fileStructure: boolean;
  basicApiDocumentation: boolean;
  advancedApiDocumentation: boolean;
  flowChart: boolean;
}

export interface CodebaseInput {
  type: 'file' | 'github' | 'azure';
  file?: File;
  url?: string;
  additionalPrompt?: string;
  summary?: string;
  options: AnalysisOptions;
}

export interface AnalysisResult {
  id: string;
  status: 'processing' | 'completed' | 'error';
  results?: {
    fileStructure?: string;
    basicApiDocumentation?: string;
    advancedApiDocumentation?: string;
    flowChart?: string;
  };
  downloadUrls?: {
    fileStructure?: string;
    basicApiDocumentation?: string;
    advancedApiDocumentation?: string;
    flowChart?: string;
  };
  error?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}