from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import json
import uuid
import os
import zipfile
import tempfile
import shutil
from typing import Optional
import ast
import subprocess

app = FastAPI(title="Codebase Analyzer API", version="1.0.0")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for analysis results (use database in production)
analysis_storage = {}

def validate_python_codebase(extract_path: str) -> bool:
    """Check if the extracted codebase contains Python files"""
    python_files = []
    for root, dirs, files in os.walk(extract_path):
        for file in files:
            if file.endswith('.py'):
                python_files.append(os.path.join(root, file))
    
    return len(python_files) > 0

def analyze_file_structure(extract_path: str) -> str:
    """Generate file structure analysis"""
    structure = []
    
    for root, dirs, files in os.walk(extract_path):
        level = root.replace(extract_path, '').count(os.sep)
        indent = ' ' * 2 * level
        structure.append(f"{indent}{os.path.basename(root)}/")
        
        subindent = ' ' * 2 * (level + 1)
        for file in files:
            if file.endswith('.py'):
                structure.append(f"{subindent}📄 {file}")
    
    return '\n'.join(structure)

def generate_basic_api_docs(extract_path: str) -> str:
    """Generate basic API documentation"""
    docs = ["# Basic API Documentation\n"]
    
    for root, dirs, files in os.walk(extract_path):
        for file in files:
            if file.endswith('.py'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    tree = ast.parse(content)
                    
                    docs.append(f"## {file}\n")
                    
                    for node in ast.walk(tree):
                        if isinstance(node, ast.FunctionDef):
                            docs.append(f"### Function: {node.name}")
                            if ast.get_docstring(node):
                                docs.append(f"**Description:** {ast.get_docstring(node)}")
                            docs.append("")
                        
                        elif isinstance(node, ast.ClassDef):
                            docs.append(f"### Class: {node.name}")
                            if ast.get_docstring(node):
                                docs.append(f"**Description:** {ast.get_docstring(node)}")
                            docs.append("")
                
                except Exception as e:
                    docs.append(f"Error parsing {file}: {str(e)}\n")
    
    return '\n'.join(docs)

def generate_advanced_api_docs(extract_path: str) -> str:
    """Generate advanced API documentation with more details"""
    docs = ["# Advanced API Documentation\n"]
    
    for root, dirs, files in os.walk(extract_path):
        for file in files:
            if file.endswith('.py'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    tree = ast.parse(content)
                    
                    docs.append(f"## Module: {file}\n")
                    
                    # Extract imports
                    imports = []
                    for node in ast.walk(tree):
                        if isinstance(node, ast.Import):
                            for name in node.names:
                                imports.append(name.name)
                        elif isinstance(node, ast.ImportFrom):
                            module = node.module or ""
                            for name in node.names:
                                imports.append(f"{module}.{name.name}")
                    
                    if imports:
                        docs.append("### Dependencies:")
                        for imp in imports[:5]:  # Limit to first 5
                            docs.append(f"- {imp}")
                        docs.append("")
                    
                    # Extract classes and functions with details
                    for node in ast.walk(tree):
                        if isinstance(node, ast.FunctionDef):
                            docs.append(f"### Function: `{node.name}`")
                            
                            # Arguments
                            args = [arg.arg for arg in node.args.args]
                            if args:
                                docs.append(f"**Parameters:** {', '.join(args)}")
                            
                            # Docstring
                            if ast.get_docstring(node):
                                docs.append(f"**Description:** {ast.get_docstring(node)}")
                            
                            docs.append("")
                        
                        elif isinstance(node, ast.ClassDef):
                            docs.append(f"### Class: `{node.name}`")
                            
                            # Base classes
                            if node.bases:
                                base_names = []
                                for base in node.bases:
                                    if isinstance(base, ast.Name):
                                        base_names.append(base.id)
                                if base_names:
                                    docs.append(f"**Inherits from:** {', '.join(base_names)}")
                            
                            # Docstring
                            if ast.get_docstring(node):
                                docs.append(f"**Description:** {ast.get_docstring(node)}")
                            
                            # Methods
                            methods = [n.name for n in node.body if isinstance(n, ast.FunctionDef)]
                            if methods:
                                docs.append(f"**Methods:** {', '.join(methods)}")
                            
                            docs.append("")
                
                except Exception as e:
                    docs.append(f"Error parsing {file}: {str(e)}\n")
    
    return '\n'.join(docs)

def generate_flowchart(extract_path: str) -> str:
    """Generate a simple flowchart representation"""
    flowchart = ["# Code Flow Chart\n"]
    flowchart.append("```mermaid")
    flowchart.append("graph TD")
    
    modules = []
    for root, dirs, files in os.walk(extract_path):
        for file in files:
            if file.endswith('.py'):
                module_name = file.replace('.py', '')
                modules.append(module_name)
    
    # Simple connections
    for i, module in enumerate(modules[:10]):  # Limit to 10 modules
        flowchart.append(f"    {module}[{module}]")
        if i > 0:
            flowchart.append(f"    {modules[i-1]} --> {module}")
    
    flowchart.append("```")
    return '\n'.join(flowchart)

@app.post("/analyze")
async def analyze_codebase(
    type: str = Form(...),
    file: Optional[UploadFile] = File(None),
    url: Optional[str] = Form(None),
    additionalPrompt: Optional[str] = Form(None),
    summary: Optional[str] = Form(None),
    options: str = Form(...)
):
    try:
        # Parse options
        analysis_options = json.loads(options)
        
        # Generate unique analysis ID
        analysis_id = str(uuid.uuid4())
        
        # Validate input
        if type == "file" and not file:
            raise HTTPException(status_code=400, detail="File is required for file upload type")
        
        if type in ["github", "azure"] and not url:
            raise HTTPException(status_code=400, detail="URL is required for repository type")
        
        # Create temporary directory for processing
        temp_dir = tempfile.mkdtemp()
        extract_path = os.path.join(temp_dir, "extracted")
        
        try:
            if type == "file":
                # Save uploaded file
                file_path = os.path.join(temp_dir, file.filename)
                with open(file_path, "wb") as buffer:
                    shutil.copyfileobj(file.file, buffer)
                
                # Extract ZIP file
                with zipfile.ZipFile(file_path, 'r') as zip_ref:
                    zip_ref.extractall(extract_path)
            
            elif type in ["github", "azure"]:
                # Clone repository (simplified - in production, use proper git cloning)
                raise HTTPException(status_code=501, detail="Repository cloning not implemented in this demo")
            
            # Validate Python codebase
            if not validate_python_codebase(extract_path):
                raise HTTPException(status_code=415, detail="This appears to be a non-Python codebase. Currently, only Python codebases are supported.")
            
            # Perform analysis based on selected options
            results = {}
            
            if analysis_options.get("fileStructure"):
                results["fileStructure"] = analyze_file_structure(extract_path)
            
            if analysis_options.get("basicApiDocumentation"):
                results["basicApiDocumentation"] = generate_basic_api_docs(extract_path)
            
            if analysis_options.get("advancedApiDocumentation"):
                results["advancedApiDocumentation"] = generate_advanced_api_docs(extract_path)
            
            if analysis_options.get("flowChart"):
                results["flowChart"] = generate_flowchart(extract_path)
            
            # Store results
            analysis_result = {
                "id": analysis_id,
                "status": "completed",
                "results": results,
                "downloadUrls": {
                    key: f"/download/{analysis_id}/{key}" 
                    for key in results.keys()
                }
            }
            
            analysis_storage[analysis_id] = analysis_result
            
            return analysis_result
        
        finally:
            # Cleanup temporary directory
            shutil.rmtree(temp_dir)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/analysis/{analysis_id}")
async def get_analysis_status(analysis_id: str):
    if analysis_id not in analysis_storage:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return analysis_storage[analysis_id]

@app.get("/download/{analysis_id}/{result_type}")
async def download_result(analysis_id: str, result_type: str):
    if analysis_id not in analysis_storage:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    analysis = analysis_storage[analysis_id]
    
    if result_type not in analysis.get("results", {}):
        raise HTTPException(status_code=404, detail="Result type not found")
    
    # Create a temporary file with the result content
    temp_file = tempfile.NamedTemporaryFile(mode='w', suffix='.md', delete=False)
    temp_file.write(analysis["results"][result_type])
    temp_file.close()
    
    return FileResponse(
        temp_file.name,
        media_type='text/markdown',
        filename=f"{result_type}.md"
    )

@app.get("/")
async def root():
    return {"message": "Codebase Analyzer API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)