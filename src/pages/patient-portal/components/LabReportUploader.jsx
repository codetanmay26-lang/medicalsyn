import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LabReportUploader = ({ onUploadComplete }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const mockUploadedReports = [
    {
      id: 1,
      name: "Blood_Test_Results_2025-09-05.pdf",
      type: "Blood Test",
      uploadDate: "2025-09-05",
      status: "analyzed",
      size: "2.4 MB",
      aiInsights: [
        "Glucose levels slightly elevated (145 mg/dL) - consider dietary adjustments",
        "Cholesterol within normal range",
        "Kidney function markers normal"
      ]
    },
    {
      id: 2,
      name: "Chest_Xray_2025-09-03.jpg",
      type: "X-Ray",
      uploadDate: "2025-09-03",
      status: "processing",
      size: "8.7 MB",
      aiInsights: []
    },
    {
      id: 3,
      name: "ECG_Report_2025-09-01.pdf",
      type: "ECG",
      uploadDate: "2025-09-01",
      status: "analyzed",
      size: "1.2 MB",
      aiInsights: [
        "Normal sinus rhythm detected",
        "No significant abnormalities found",
        "Heart rate: 72 bpm (normal range)"
      ]
    }
  ];

  const [reports, setReports] = useState(mockUploadedReports);

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFiles(e?.dataTransfer?.files);
    }
  };

  const handleChange = (e) => {
    e?.preventDefault();
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFiles(e?.target?.files);
    }
  };

  const handleFiles = (files) => {
    Array.from(files)?.forEach(file => {
      if (validateFile(file)) {
        uploadFile(file);
      }
    });
  };

  const validateFile = (file) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes?.includes(file?.type)) {
      alert('Please upload only PDF, JPEG, or PNG files.');
      return false;
    }

    if (file?.size > maxSize) {
      alert('File size must be less than 10MB.');
      return false;
    }

    return true;
  };

  const uploadFile = (file) => {
    const fileId = Date.now() + Math.random();
    
    // Initialize progress
    setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const currentProgress = prev?.[fileId] || 0;
        if (currentProgress >= 100) {
          clearInterval(progressInterval);
          
          // Add to reports after upload complete
          const newReport = {
            id: fileId,
            name: file?.name,
            type: getReportType(file?.name),
            uploadDate: new Date()?.toISOString()?.split('T')?.[0],
            status: "processing",
            size: formatFileSize(file?.size),
            aiInsights: []
          };
          
          setReports(prev => [newReport, ...prev]);
          
          // Simulate AI analysis after 3 seconds
          setTimeout(() => {
            setReports(prev => prev?.map(report => 
              report?.id === fileId 
                ? { 
                    ...report, 
                    status: "analyzed",
                    aiInsights: generateMockInsights(report?.type)
                  }
                : report
            ));
            
            if (onUploadComplete) {
              onUploadComplete(newReport);
            }
          }, 3000);
          
          return prev;
        }
        
        return { ...prev, [fileId]: currentProgress + 10 };
      });
    }, 200);
  };

  const getReportType = (filename) => {
    const name = filename?.toLowerCase();
    if (name?.includes('blood') || name?.includes('lab')) return 'Blood Test';
    if (name?.includes('xray') || name?.includes('x-ray')) return 'X-Ray';
    if (name?.includes('ecg') || name?.includes('ekg')) return 'ECG';
    if (name?.includes('mri')) return 'MRI';
    if (name?.includes('ct') || name?.includes('scan')) return 'CT Scan';
    return 'Lab Report';
  };

  const generateMockInsights = (type) => {
    const insights = {
      'Blood Test': [
        "All major markers within normal ranges",
        "Vitamin D levels slightly low - consider supplementation",
        "Liver function tests normal"
      ],
      'X-Ray': [
        "No acute abnormalities detected",
        "Lung fields clear",
        "Heart size within normal limits"
      ],
      'ECG': [
        "Normal sinus rhythm",
        "No arrhythmias detected",
        "QT interval normal"
      ],
      'Lab Report': [
        "Results processed successfully",
        "Key values flagged for review",
        "Trends analysis available"
      ]
    };
    
    return insights?.[type] || insights?.['Lab Report'];
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'analyzed': return 'text-success bg-success/10 border-success/20';
      case 'processing': return 'text-warning bg-warning/10 border-warning/20';
      case 'error': return 'text-error bg-error/10 border-error/20';
      default: return 'text-text-secondary bg-muted border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'analyzed': return 'CheckCircle';
      case 'processing': return 'Clock';
      case 'error': return 'XCircle';
      default: return 'FileText';
    }
  };

  const getReportIcon = (type) => {
    switch (type) {
      case 'Blood Test': return 'Droplets';
      case 'X-Ray': return 'Scan';
      case 'ECG': return 'Activity';
      case 'MRI': return 'Brain';
      case 'CT Scan': return 'Scan';
      default: return 'FileText';
    }
  };

  const deleteReport = (reportId) => {
    setReports(prev => prev?.filter(report => report?.id !== reportId));
  };

  const viewReport = (report) => {
    // In a real app, this would open the file viewer
    alert(`Opening ${report?.name}...`);
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Lab Reports</h2>
        <p className="text-sm text-text-secondary mt-1">
          Upload your lab reports for AI analysis and doctor review
        </p>
      </div>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-medical ${
          dragActive 
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Icon name="Upload" size={32} className="text-primary" />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Drop your lab reports here
            </h3>
            <p className="text-text-secondary mb-4">
              or click to browse files
            </p>
            <p className="text-sm text-text-secondary">
              Supports PDF, JPEG, PNG files up to 10MB
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={() => fileInputRef?.current?.click()}
            iconName="FolderOpen"
            iconPosition="left"
            iconSize={16}
          >
            Browse Files
          </Button>
        </div>
      </div>
      {/* Upload Progress */}
      {Object.keys(uploadProgress)?.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-medium text-text-primary">Uploading...</h3>
          {Object.entries(uploadProgress)?.map(([fileId, progress]) => (
            <div key={fileId} className="bg-muted rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">
                  Uploading file...
                </span>
                <span className="text-sm text-text-secondary">{progress}%</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Uploaded Reports */}
      {reports?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">Your Reports</h3>
          <div className="space-y-3">
            {reports?.map((report) => (
              <div key={report?.id} className="bg-muted rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name={getReportIcon(report?.type)} size={20} className="text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-text-primary">{report?.name}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-text-secondary">{report?.type}</span>
                        <span className="text-sm text-text-secondary">{report?.size}</span>
                        <span className="text-sm text-text-secondary">
                          Uploaded: {new Date(report.uploadDate)?.toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(report?.status)}`}>
                        <Icon name={getStatusIcon(report?.status)} size={12} />
                        <span className="capitalize">{report?.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      iconSize={16}
                      onClick={() => viewReport(report)}
                      className="text-text-secondary hover:text-text-primary"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      iconSize={16}
                      onClick={() => deleteReport(report?.id)}
                      className="text-text-secondary hover:text-error"
                    />
                  </div>
                </div>

                {/* AI Insights */}
                {report?.status === 'analyzed' && report?.aiInsights?.length > 0 && (
                  <div className="mt-4 p-3 bg-surface rounded-lg border border-border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Brain" size={16} className="text-primary" />
                      <span className="text-sm font-medium text-text-primary">AI Analysis</span>
                    </div>
                    <ul className="space-y-1">
                      {report?.aiInsights?.map((insight, index) => (
                        <li key={index} className="text-sm text-text-secondary flex items-start space-x-2">
                          <Icon name="ChevronRight" size={12} className="mt-0.5 text-primary" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-text-secondary">
                        <Icon name="Info" size={12} className="inline mr-1" />
                        AI analysis has been sent to your healthcare provider for review
                      </p>
                    </div>
                  </div>
                )}

                {/* Processing Status */}
                {report?.status === 'processing' && (
                  <div className="mt-4 p-3 bg-warning/5 rounded-lg border border-warning/20">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-warning border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-warning">
                        AI analysis in progress... This may take a few minutes.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {reports?.length === 0 && Object.keys(uploadProgress)?.length === 0 && (
        <div className="mt-6 text-center py-8">
          <Icon name="FileText" size={48} className="text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No reports uploaded yet</h3>
          <p className="text-text-secondary">
            Upload your first lab report to get started with AI-powered analysis
          </p>
        </div>
      )}
    </div>
  );
};

export default LabReportUploader;