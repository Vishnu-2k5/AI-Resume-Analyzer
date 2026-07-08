import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

/**
 * DragDropUpload handles visual drag-and-drop actions for resume PDF files,
 * including validation checks for file size and MIME type.
 *
 * @param {object} props - Component props.
 * @param {File|null} props.file - Selected File object.
 * @param {function} props.setFile - State modifier to update selected File.
 * @param {function} props.setError - State modifier to dispatch error alerts.
 */
export default function DragDropUpload({ file, setFile, setError }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef(null);

  // Validate the file is a PDF.
  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;

    const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setError('Invalid file type. Please upload a PDF resume (.pdf) only.');
      return false;
    }

    // Limit to 10MB
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size too large. Resume must be less than 10MB.');
      return false;
    }

    setError('');
    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  // Convert bytes to readable formats (MB).
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`group relative flex min-h-60 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-all duration-300 ${
        isDragActive
          ? 'border-blue-500 bg-blue-50/30'
          : file
          ? 'border-emerald-200 bg-emerald-50/10'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/30 shadow-xs'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,application/pdf"
        onChange={handleChange}
      />

      {file ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <FileText className="h-8 w-8" />
          </div>
          <div>
            <p className="max-w-xs truncate text-sm font-semibold text-slate-800 sm:max-w-md">
              {file.name}
            </p>
            <p className="mt-1 text-xs text-slate-500">{formatFileSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={clearFile}
            className="flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-rose-600 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
            Remove File
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center cursor-pointer" onClick={onButtonClick}>
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-blue-600 border border-slate-100 transition-transform group-hover:scale-105">
            <UploadCloud className="h-7 w-7" />
          </div>
          <p className="text-sm font-medium text-slate-700">
            Drag & drop your resume, or <span className="text-blue-600 font-semibold group-hover:underline">browse</span>
          </p>
          <p className="mt-2 text-xs text-slate-500">Supports PDF format up to 10MB</p>
        </div>
      )}
    </div>
  );
}
