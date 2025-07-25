# Codebase Analyzer

A React-based web application that integrates with Python to analyze Python codebases and generate comprehensive documentation, API references, and flowcharts.

## Features

- **Multiple Input Methods**: 
  - Upload ZIP files containing Python codebases
  - Connect to GitHub repositories
  - Connect to Azure DevOps repositories

- **Analysis Options**:
  - File Structure Analysis
  - Basic API Documentation
  - Advanced API Documentation  
  - Flow Chart Generation

- **Language Support**: Currently supports Python codebases only (with validation)

- **Download Results**: Generated documentation and charts can be downloaded in various formats

## Tech Stack

### Frontend (React)
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Dropzone** for file uploads
- **Axios** for API communication
- **Lucide React** for icons

### Backend (Python)
- **FastAPI** for the REST API
- **Python AST** for code analysis
- **ZIP file handling** for codebase extraction
- **Markdown generation** for documentation

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- pip

### Frontend Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Backend Setup

1. **Navigate to the Python backend directory**:
   ```bash
   cd python-backend
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the FastAPI server**:
   ```bash
   python main.py
   ```

4. **API Documentation**:
   Visit [http://localhost:8000/docs](http://localhost:8000/docs) for interactive API documentation

## Usage

1. **Choose Input Method**:
   - **Upload ZIP**: Drag and drop or select a ZIP file containing your Python codebase
   - **GitHub**: Enter a GitHub repository URL
   - **Azure DevOps**: Enter an Azure DevOps repository URL

2. **Provide Context** (Optional):
   - Add additional prompts for specific analysis requirements
   - Provide a summary of your codebase's purpose

3. **Select Analysis Options**:
   - ✅ File Structure: Directory tree and organization
   - ✅ Basic API Documentation: Simple function and class documentation  
   - ✅ Advanced API Documentation: Detailed docs with parameters and examples
   - ✅ Flow Chart: Visual representation of code relationships

4. **Analyze**: Click "Analyze Codebase" to start the process

5. **Download Results**: Once complete, download the generated documentation and charts

## Project Structure

```
codebase-analyzer-ui/
├── public/                 # Static files
├── src/
│   ├── components/        # React components
│   │   ├── Header.tsx
│   │   ├── CodebaseUploader.tsx
│   │   ├── OptionsSelector.tsx
│   │   └── AnalysisResults.tsx
│   ├── services/          # API services
│   │   └── api.ts
│   ├── types.ts           # TypeScript interfaces
│   ├── App.tsx            # Main App component
│   └── index.tsx          # Entry point
├── python-backend/        # Python FastAPI backend
│   ├── main.py           # FastAPI application
│   └── requirements.txt  # Python dependencies
├── package.json
├── tailwind.config.js
└── README.md
```

## API Endpoints

### POST /analyze
Analyzes a codebase and returns results
- **Body**: FormData with file/URL and analysis options
- **Returns**: Analysis result with download URLs

### GET /analysis/{analysis_id}
Gets the status of an analysis
- **Returns**: Current analysis status and results

### GET /download/{analysis_id}/{result_type}
Downloads a specific analysis result
- **Returns**: File download (PDF/Markdown)

## Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8000
```

## Language Support & Validation

- **Currently Supported**: Python only
- **Validation**: The application automatically detects non-Python codebases and shows an error message
- **Future Support**: Additional languages can be added by extending the backend analysis functions

## Error Handling

- **File Upload**: Validates ZIP files and Python content
- **Repository URLs**: Validates URL format and accessibility
- **Analysis Options**: Ensures at least one option is selected
- **Backend Errors**: Provides user-friendly error messages

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the Python backend is running on port 8000
2. **File Upload Issues**: Check that ZIP files contain Python (.py) files
3. **Analysis Failures**: Verify Python syntax in uploaded codebases
4. **Download Problems**: Ensure analysis completed successfully before downloading

### Support

For issues and questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Review the API documentation at http://localhost:8000/docs
3. Check browser console for error messages