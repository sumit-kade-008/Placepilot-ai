import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Eye, 
  ShieldCheck, 
  FileCheck, 
  Lock, 
  Sparkles,
  Edit2,
  X
} from 'lucide-react';
import { Scheme, DocumentItem, DocumentStatus } from '../types';

interface DocumentStudioProps {
  schemes: Scheme[];
  initialSchemeId?: string;
  documents: DocumentItem[];
  onSaveDocument: (doc: DocumentItem) => void;
  onDeleteDocument: (docId: string) => void;
  onProceedToForm: (schemeId: string) => void;
}

export const DocumentStudio: React.FC<DocumentStudioProps> = ({
  schemes,
  initialSchemeId = 'MAHA_OBC_SCHOLARSHIP',
  documents,
  onSaveDocument,
  onDeleteDocument,
  onProceedToForm
}) => {
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(initialSchemeId);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<DocumentItem | null>(null);
  const [consentGiven, setConsentGiven] = useState<boolean>(true);
  const [activeUploadDocType, setActiveUploadDocType] = useState<string>('');
  const [isProcessingOcr, setIsProcessingOcr] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedScheme = schemes.find(s => s.id === selectedSchemeId) || schemes[0];
  const requiredList = selectedScheme?.requiredDocuments || [];

  // Documents matching current scheme
  const schemeDocs = documents.filter(d => !d.schemeId || d.schemeId === selectedSchemeId);

  const handleTriggerUpload = (docType: string) => {
    setActiveUploadDocType(docType);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds maximum allowed 5MB limit.');
      return;
    }

    // Validate type (PDF, PNG, JPEG)
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid PDF, JPG, or PNG document.');
      return;
    }

    setIsProcessingOcr(true);

    const docType = activeUploadDocType || 'Required Document';
    const isIncome = docType.toLowerCase().includes('income');
    const isCaste = docType.toLowerCase().includes('caste');
    const isDomicile = docType.toLowerCase().includes('domicile');

    // Simulate OCR Extraction via backend endpoint or deterministic extractor
    setTimeout(() => {
      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        citizenId: 'citizen-demo-01',
        schemeId: selectedSchemeId,
        documentType: docType,
        name: docType,
        fileName: file.name,
        fileType: file.type,
        fileSize: `${Math.round(file.size / 1024)} KB`,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Extracted',
        extractedData: {
          certificateNumber: isIncome ? `INC/REV/2025/${Math.floor(10000 + Math.random() * 90000)}` : isCaste ? `OBC/MH/2022/${Math.floor(10000 + Math.random() * 90000)}` : isDomicile ? `DOM/THN/2023/${Math.floor(10000 + Math.random() * 90000)}` : `CERT/${Date.now().toString().slice(-6)}`,
          candidateName: 'Vedant Sharma',
          issuerAuthority: isIncome ? 'Tahsildar Office, Thane' : 'Sub-Divisional Officer, Maharashtra',
          annualIncome: isIncome ? '150000' : undefined,
          issueDate: '2025-06-12'
        },
        verifiedByCitizen: false,
        consentGranted: consentGiven
      };

      onSaveDocument(newDoc);
      setIsProcessingOcr(false);
      setSelectedDocForPreview(newDoc);
    }, 600);
  };

  const handleCitizenVerifyToggle = (doc: DocumentItem) => {
    const updated: DocumentItem = {
      ...doc,
      verifiedByCitizen: !doc.verifiedByCitizen,
      status: !doc.verifiedByCitizen ? 'Verified by Citizen' : 'Extracted'
    };
    onSaveDocument(updated);
    if (selectedDocForPreview?.id === doc.id) {
      setSelectedDocForPreview(updated);
    }
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'Verified by Citizen':
      case 'Officially Verified':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-[11px] font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>{status}</span>
          </span>
        );
      case 'Extracted':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-700/60 text-[11px] font-bold">
            <Sparkles className="w-3 h-3 text-teal-400" />
            <span>OCR Extracted</span>
          </span>
        );
      case 'Uploaded':
      case 'Processing':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700/60 text-[11px] font-bold">
            <span>Processing</span>
          </span>
        );
      case 'Missing':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800 text-[11px] font-bold">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            <span>Missing</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#25303c]">
        <div>
          <h2 className="text-2xl font-black text-[#fdfbf7] flex items-center space-x-2">
            <FileCheck className="w-6 h-6 text-emerald-400" />
            <span>Document Readiness Studio</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Personalized document checklist, secure local storage, OCR extraction, and citizen verification.
          </p>
        </div>

        {/* Consent Badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#161f27] border border-[#273646] text-xs">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <label className="flex items-center space-x-2 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="accent-emerald-500 rounded"
            />
            <span>Consent Granted for Local Form Prefill</span>
          </label>
        </div>
      </div>

      {/* Scheme Selector */}
      <div className="bg-[#171f27] border border-[#283543] rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <label className="text-xs font-bold text-zinc-300 block mb-1.5 uppercase tracking-wider">
            Active Scheme Checklist:
          </label>
          <select
            value={selectedSchemeId}
            onChange={(e) => setSelectedSchemeId(e.target.value)}
            className="w-full px-3 py-2 bg-[#12161a] border border-[#2d3947] rounded-xl text-sm font-semibold text-white"
          >
            {schemes.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>

        <div className="text-right flex-shrink-0">
          <span className="text-xs text-zinc-400 block">Checklist Progress:</span>
          <span className="text-lg font-black text-emerald-400">
            {schemeDocs.filter(d => d.verifiedByCitizen).length} / {requiredList.length} Verified
          </span>
        </div>
      </div>

      {/* Main Checklist Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Required Documents Checklist */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-bold text-sm text-zinc-200 uppercase tracking-wider">
            Mandatory Documents Checklist for this Scheme
          </h3>

          <div className="space-y-3">
            {requiredList.map((reqDocName, idx) => {
              const uploadedMatch = schemeDocs.find(d => 
                d.documentType.toLowerCase().includes(reqDocName.toLowerCase()) || 
                reqDocName.toLowerCase().includes(d.documentType.toLowerCase())
              );

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition ${
                    uploadedMatch
                      ? 'bg-[#182028] border-emerald-500/40'
                      : 'bg-[#141b22] border-[#25313d]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <FileText className={`w-4 h-4 ${uploadedMatch ? 'text-emerald-400' : 'text-zinc-500'}`} />
                        <h4 className="font-bold text-sm text-zinc-100">{reqDocName}</h4>
                      </div>

                      {uploadedMatch ? (
                        <p className="text-xs text-zinc-400">
                          Uploaded: <span className="text-zinc-200 font-mono">{uploadedMatch.fileName}</span> ({uploadedMatch.fileSize || '300 KB'}) • {uploadedMatch.uploadDate}
                        </p>
                      ) : (
                        <p className="text-xs text-zinc-500">
                          Required by official department guidelines. Upload clear PDF or JPG scan.
                        </p>
                      )}
                    </div>

                    {/* Right Action / Status */}
                    <div className="flex items-center space-x-2 self-start sm:self-auto flex-shrink-0">
                      {uploadedMatch ? (
                        <>
                          {getStatusBadge(uploadedMatch.status)}
                          <button
                            onClick={() => setSelectedDocForPreview(uploadedMatch)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                            title="Inspect Extracted Data & Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteDocument(uploadedMatch.id)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 transition"
                            title="Remove Document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleTriggerUpload(reqDocName)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center space-x-1.5 transition"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload File</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Document OCR Inspection & Citizen Verification */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-zinc-200 uppercase tracking-wider">
            Extracted Document Inspection
          </h3>

          {selectedDocForPreview ? (
            <div className="bg-[#182028] border border-[#2d3a48] rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#253240]">
                <div>
                  <h4 className="font-bold text-sm text-zinc-100">{selectedDocForPreview.name}</h4>
                  <p className="text-xs text-zinc-400 font-mono">{selectedDocForPreview.fileName}</p>
                </div>
                <button
                  onClick={() => setSelectedDocForPreview(null)}
                  className="p-1 text-zinc-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Extracted Key-Values */}
              <div className="bg-[#12161a] border border-[#242f3a] rounded-xl p-3 space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block">
                  AI OCR Extracted Attributes:
                </span>
                {selectedDocForPreview.extractedData && Object.keys(selectedDocForPreview.extractedData).length > 0 ? (
                  Object.entries(selectedDocForPreview.extractedData).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-zinc-800/60 pb-1">
                      <span className="text-zinc-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="font-mono text-emerald-300 font-semibold">{String(v)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-500 italic">No structured data extracted yet.</p>
                )}
              </div>

              {/* Citizen Verification Toggle */}
              <div className="p-3 rounded-xl bg-[#131b22] border border-emerald-700/40 space-y-2">
                <label className="flex items-start space-x-2 text-xs text-zinc-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDocForPreview.verifiedByCitizen}
                    onChange={() => handleCitizenVerifyToggle(selectedDocForPreview)}
                    className="accent-emerald-500 rounded mt-0.5"
                  />
                  <span>
                    <strong>I verify this extracted data</strong> matches my physical/original government document.
                  </span>
                </label>
              </div>
            </div>
          ) : (
            <div className="bg-[#151c23] border border-dashed border-zinc-700 rounded-2xl p-8 text-center text-zinc-500 text-xs space-y-2">
              <Eye className="w-8 h-8 mx-auto text-zinc-600" />
              <p>Select an uploaded document to inspect extracted numbers and confirm accuracy.</p>
            </div>
          )}

          {/* Quick Navigation to Application Form */}
          <div className="bg-[#141b22] border border-[#25313d] rounded-2xl p-4 text-xs space-y-3">
            <h5 className="font-bold text-zinc-200">Ready for Application Form?</h5>
            <p className="text-zinc-400">
              Extracted certificate numbers will automatically populate matching fields in the form draft.
            </p>
            <button
              onClick={() => onProceedToForm(selectedSchemeId)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950 transition"
            >
              Open Application Form Studio &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
