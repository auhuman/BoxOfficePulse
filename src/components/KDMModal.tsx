import React from 'react';
import { Key, ShieldCheck, X, Copy, Check, Lock } from 'lucide-react';
import type { ScreenAllocation } from '../types';

interface KDMModalProps {
  isOpen: boolean;
  onClose: () => void;
  allocation?: ScreenAllocation | null;
  customCert?: any | null;
}

export const KDMModal: React.FC<KDMModalProps> = ({
  isOpen,
  onClose,
  allocation,
  customCert
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const licenseKey = allocation?.dcpLicenseKey || customCert?.kdmUuid || 'KDM-SEC-ATX-M01-99812';
  const movieTitle = allocation?.movieTitle || 'Neon Odyssey: 2099';
  const screenName = allocation?.screenName || 'Auditorium 4 - Standard';
  const expiresAt = allocation?.kdmExpiresAt || customCert?.authorizedWindow || '2026-09-12 04:00:00 UTC';

  const xmlPayload = `<?xml version="1.0" encoding="UTF-8"?>
<KDM xmlns="http://www.smpte-ra.org/schemas/430-1/2006/KDM">
  <Header>
    <Id>urn:uuid:${customCert?.kdmUuid || '4fa82910-c081-420a-8bf7-10294819a912'}</Id>
    <AnnotationText>Autonomous Studio Reallocation KDM</AnnotationText>
    <IssueDate>${new Date().toISOString()}</IssueDate>
    <Issuer>Apex Horizon Digital Cinema Security CA</Issuer>
    <Recipient>
      <X509SubjectName>CN=${allocation?.theaterId || 'T-ATX-01'}.Screen${allocation?.screenNumber || '4'},O=Multiplex,C=US</X509SubjectName>
      <X509IssuerSerial>Apex-DCP-Root-2026</X509IssuerSerial>
    </Recipient>
  </Header>
  <AuthenticatedPublic>
    <CompositionPlaylistId>urn:uuid:${customCert?.targetDcpUuid || '8329ab41-99bc-4712-a1f2-984719208311'}</CompositionPlaylistId>
    <ContentTitleText>${movieTitle}</ContentTitleText>
    <AuthorizedWindow>
      <NotValidBefore>${new Date().toISOString()}</NotValidBefore>
      <NotValidAfter>${expiresAt}</NotValidAfter>
    </AuthorizedWindow>
  </AuthenticatedPublic>
  <EncryptedContentKeys>
    <!-- AES-128 GCM Media Keys Signed by Gemini Autonomous Supervisor -->
    <KeyInfo>
      <EncryptedKeyAlgorithm>http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p</EncryptedKeyAlgorithm>
      <CipherValue>MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAw9x...</CipherValue>
    </KeyInfo>
  </EncryptedContentKeys>
</KDM>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(xmlPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0b0f17] border border-cyan-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-cyan-500/20">
        {/* Modal Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                Digital Cinema Package (DCP) Key Delivery Message
              </h3>
              <p className="text-[11px] text-slate-400">
                SMPTE 430-1 / 430-3 Cryptographic Screen Authorization Certificate
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/60 p-3.5 rounded-xl border border-white/5">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Authorized Feature</span>
              <span className="font-bold text-white text-sm">{movieTitle}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Target Screen</span>
              <span className="font-bold text-cyan-400 text-sm">{screenName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">License Key ID</span>
              <span className="font-mono text-slate-200 text-xs">{licenseKey}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Validity Window</span>
              <span className="font-mono text-emerald-400 text-xs">{expiresAt}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                SMPTE KDM XML Certificate Payload:
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/20"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy XML'}
              </button>
            </div>
            <pre className="code-block max-h-56 overflow-y-auto text-[11px] leading-relaxed">
              {xmlPayload}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Cryptographically Verified by Autonomous Studio Supervisor</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-all"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
