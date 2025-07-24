// components/UploadResumes.jsx
import { useState, useRef } from 'react';

const UploadResumes = ({ jobId }) => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Files select karne ka handler
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 100) {
      alert('Maximum 100 resumes upload kar sakte hain!');
      return;
    }
    setFiles(selectedFiles);
    
    // Progress tracking shuru
    const progressObj = {};
    selectedFiles.forEach(file => {
      progressObj[file.name] = 0;
    });
    setUploadProgress(progressObj);
  };

  // Upload karne ka handler
  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('jobId', jobId);
    files.forEach(file => formData.append('resume', file));

    try {
      const res = await fetch('/api/resumes/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (res.ok) {
        alert('Sab resumes successfully upload ho gaye hain!');
        setFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Upload mein error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Progress bar dikhane ka function
  const renderProgressBar = (fileName) => {
    const progress = uploadProgress[fileName] || 0;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Resumes Upload Karein</h1>
      <p className="text-gray-600 mb-6">Job ID: <span className="font-mono bg-gray-100 p-1 rounded">{jobId}</span></p>

      {/* File Input Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 cursor-pointer hover:border-blue-400 transition-colors">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept=".pdf"
          className="hidden"
          id="resume-upload"
        />
        <label htmlFor="resume-upload" className="cursor-pointer block">
          <div className="flex flex-col items-center justify-center">
            <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="text-lg text-gray-700 mb-1">Yahan click karke resumes select karein</p>
            <p className="text-sm text-gray-500">PDF files only (Max 100 files)</p>
          </div>
        </label>
      </div>

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">
            {files.length} resume select kiye gaye hain:
          </h3>
          <div className="max-h-60 overflow-y-auto border rounded-lg p-4 bg-gray-50">
            {files.map((file, index) => (
              <div key={index} className="mb-3 last:mb-0 p-2 bg-white rounded-md">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                {renderProgressBar(file.name)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={files.length === 0 || isUploading}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center ${
          files.length === 0 || isUploading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700'
        } transition duration-300`}
      >
        {isUploading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </>
        ) : (
          'Upload Resumes'
        )}
      </button>

      {/* Progress Indicator */}
      {isUploading && files.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-blue-700">
              Progress
            </span>
            <span className="text-sm font-medium text-blue-700">
              {Object.values(uploadProgress).filter(p => p === 100).length}/{files.length} Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{
              width: `${(Object.values(uploadProgress).filter(p => p === 100).length / files.length) * 100}%`
            }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadResumes;