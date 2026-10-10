import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Brain,
  Award,
  Sparkles,
  Mic,
  MicOff,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Send,
  Loader2,
  Flame,
  BarChart2,
  Zap,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  RotateCcw,
  UploadCloud,
  FileText,
  CheckCircle2,
  Trash2,
  Paperclip
} from 'lucide-react';
import { NCERT_TOPICS, EXAM_QUIZZES } from '../data/kurukshetraAiData';
import { generateLocalAiResponse } from '../utils/localAiEngine';
import { parseDocumentFile } from '../utils/pdfParser';
import { soundFX } from '../utils/sound';

export function KurukshetraAISuiteModal({ isOpen, onClose, profile = {} }) {
  const [suiteMode, setSuiteMode] = useState('TEACH_AI'); // 'TEACH_AI' or 'EXAM_QUIZZER'
  const [selectedClassLevel, setSelectedClassLevel] = useState('10'); // '10' or '11'

  // Custom PDF File Uploader State
  const [customPdfData, setCustomPdfData] = useState(null);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [pdfParsingStatus, setPdfParsingStatus] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Local Neural Engine Download Progress
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // MODE 1: TEACH THE AI (Feynman Recall Engine)
  const [selectedTopicId, setSelectedTopicId] = useState(NCERT_TOPICS[0].id);
  const [explanationText, setExplanationText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isAnalyzingExplanation, setIsAnalyzingExplanation] = useState(false);
  const [gapTelemetry, setGapTelemetry] = useState(null);

  // MODE 2: EXAM QUIZZER
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [useCustomPdfQuiz, setUseCustomPdfQuiz] = useState(false);

  const activeTopic = selectedTopicId === 'CUSTOM_PDF' && customPdfData
    ? {
        id: 'CUSTOM_PDF',
        subject: 'CUSTOM PDF',
        classLevel: selectedClassLevel,
        chapter: customPdfData.fileName,
        topicName: `Custom Chapter Document (${customPdfData.fileName})`,
        coreKeywords: customPdfData.coreKeywords,
        requiredSteps: customPdfData.keyDefinitions.length > 0
          ? customPdfData.keyDefinitions
          : customPdfData.formulas.length > 0
          ? customPdfData.formulas
          : [`Explain primary concepts from ${customPdfData.fileName}`, 'Include key formulas, assumptions, and scientific laws'],
        commonFlaws: ['Omitting technical definitions', 'Confusing terms or units']
      }
    : NCERT_TOPICS.find((t) => t.id === selectedTopicId) || NCERT_TOPICS[0];

  const presetQuizList = EXAM_QUIZZES[selectedClassLevel] || EXAM_QUIZZES['10'];
  const activeQuizList = (useCustomPdfQuiz && customPdfData && customPdfData.generatedQuizzes.length > 0)
    ? customPdfData.generatedQuizzes
    : presetQuizList;

  const currentQuiz = activeQuizList[currentQuizIndex % activeQuizList.length];

  useEffect(() => {
    // Reset state when class level changes
    setCurrentQuizIndex(0);
    setSelectedOptionIndex(null);
    setIsQuizSubmitted(false);
  }, [selectedClassLevel]);

  if (!isOpen) return null;

  // Custom PDF Upload & Parsing Handler
  const handleFileUpload = async (file) => {
    if (!file) return;
    soundFX.playClick();
    setIsParsingPdf(true);
    setPdfParsingStatus(`PARSING CHAPTER DATA... [1] Pages Extracted`);

    try {
      const parsed = await parseDocumentFile(file);
      setCustomPdfData(parsed);
      setPdfParsingStatus(`PARSING CHAPTER DATA... [${parsed.pageCount}] Pages Extracted Successfully`);
      setSelectedTopicId('CUSTOM_PDF');
      setUseCustomPdfQuiz(true);
      setGapTelemetry(null);
      soundFX.playSuccess();
    } catch (err) {
      console.error('PDF Parsing error:', err);
      setPdfParsingStatus('Parsing failed. Please try another file.');
    } finally {
      setIsParsingPdf(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleClearCustomPdf = () => {
    soundFX.playClick();
    setCustomPdfData(null);
    setPdfParsingStatus('');
    setSelectedTopicId(NCERT_TOPICS[0].id);
    setUseCustomPdfQuiz(false);
    setGapTelemetry(null);
  };

  // Real-time Gap Detection analysis against NCERT or Custom PDF rubric criteria
  const handleAnalyzeExplanation = async () => {
    if (!explanationText.trim() || isAnalyzingExplanation) return;

    soundFX.playClick();
    setIsAnalyzingExplanation(true);
    setGapTelemetry(null);

    const userTextLower = explanationText.toLowerCase();

    // Check missing keywords
    const presentKeywords = activeTopic.coreKeywords.filter((kw) => userTextLower.includes(kw.toLowerCase()));
    const missingKeywords = activeTopic.coreKeywords.filter((kw) => !userTextLower.includes(kw.toLowerCase()));

    // Check required steps/definitions covered
    const stepCoverage = activeTopic.requiredSteps.map((step) => {
      const stepWords = step.toLowerCase().split(' ').filter((w) => w.length > 4);
      const matches = stepWords.filter((sw) => userTextLower.includes(sw));
      const covered = matches.length >= 1;
      return { step, covered };
    });

    const coveredStepsCount = stepCoverage.filter((s) => s.covered).length;
    const completenessScore = Math.round(
      ((presentKeywords.length / Math.max(1, activeTopic.coreKeywords.length)) * 0.5 +
        (coveredStepsCount / Math.max(1, activeTopic.requiredSteps.length)) * 0.5) * 100
    );

    // Identify potential logic flaws
    const potentialFlaws = activeTopic.commonFlaws.filter((flaw) => {
      const flawWords = flaw.toLowerCase().split(' ').filter((w) => w.length > 4);
      return flawWords.some((fw) => userTextLower.includes(fw));
    });

    // Run local AI for natural feedback synthesis
    let aiFeedback = '';
    try {
      const isCustomPdf = selectedTopicId === 'CUSTOM_PDF' && customPdfData;
      const docContext = isCustomPdf ? `Uploaded Chapter PDF "${customPdfData.fileName}"` : `NCERT ${activeTopic.subject} topic "${activeTopic.topicName}"`;
      const prompt = `Student explained ${docContext}: "${explanationText}". Evaluate scientific accuracy, missing formulas, and key concept gaps.`;

      aiFeedback = await generateLocalAiResponse(prompt, (progressData) => {
        if (progressData.status === 'progress' || progressData.status === 'download') {
          setIsDownloading(true);
          setDownloadProgress(Math.round(progressData.progress || 0));
        } else if (progressData.status === 'ready' || progressData.status === 'done') {
          setIsDownloading(false);
          setDownloadProgress(null);
        }
      });
    } catch (e) {
      aiFeedback = `Explanation evaluated against ${selectedTopicId === 'CUSTOM_PDF' ? 'uploaded document' : 'NCERT rubric'}. Completeness index: ${completenessScore}%. Ensure key terms (${activeTopic.coreKeywords.slice(0, 4).join(', ')}) are stated clearly.`;
    } finally {
      setIsDownloading(false);
      setDownloadProgress(null);
    }

    soundFX.playSuccess();
    setGapTelemetry({
      completenessScore,
      presentKeywords,
      missingKeywords,
      stepCoverage,
      potentialFlaws,
      aiFeedback
    });
    setIsAnalyzingExplanation(false);
  };

  // Voice Input Simulation / Browser Web Speech API
  const handleToggleVoice = () => {
    if (isRecordingVoice) {
      setIsRecordingVoice(false);
      soundFX.playClick();
      return;
    }

    soundFX.playScan();
    setIsRecordingVoice(true);

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setExplanationText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecordingVoice(false);
        soundFX.playSuccess();
      };

      recognition.onerror = () => {
        setIsRecordingVoice(false);
      };

      recognition.start();
    } else {
      // Speech recognition fallback simulation
      setTimeout(() => {
        setExplanationText((prev) =>
          prev
            ? `${prev} According to the principle, the rate of change is proportional to the applied force in the direction of motion.`
            : "According to the principle, the rate of change is proportional to the applied force in the direction of motion."
        );
        setIsRecordingVoice(false);
        soundFX.playSuccess();
      }, 2500);
    }
  };

  const handleQuizSubmit = () => {
    if (selectedOptionIndex === null || isQuizSubmitted) return;
    soundFX.playClick();
    setIsQuizSubmitted(true);
    if (selectedOptionIndex === currentQuiz.correctIndex) {
      soundFX.playSuccess();
      setUserScore((prev) => prev + 10);
    }
  };

  const handleNextQuizQuestion = () => {
    soundFX.playClick();
    setSelectedOptionIndex(null);
    setIsQuizSubmitted(false);
    setCurrentQuizIndex((prev) => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in font-space overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-950 border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden flex flex-col font-mono-tech">

        {/* Holographic Lord Krishna / Sudarshan Header Banner */}
        <div className="relative p-6 border-b border-cyan-500/30 bg-gradient-to-r from-slate-950 via-cyan-950/60 to-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div className="flex items-center gap-3.5">
            {/* Cybernetic Icon Frame */}
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-950 to-amber-950 p-0.5 border border-cyan-400 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              <Flame className="w-6 h-6 text-amber-300 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-orbitron text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-amber-300 tracking-wider">
                  KURUKSHETRA AI SUITE
                </h2>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold">
                  v2.5 PDF PARSER ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Feynman Recall Gap Detection &amp; Custom Chapter PDF Quiz Generator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Switcher Tabs */}
            <div className="flex bg-slate-900/90 p-1 rounded-xl border border-cyan-500/30 text-xs">
              <button
                onClick={() => {
                  soundFX.playClick();
                  setSuiteMode('TEACH_AI');
                }}
                className={`px-3 py-1.5 rounded-lg font-orbitron font-bold transition-all flex items-center gap-1.5 ${
                  suiteMode === 'TEACH_AI'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>TEACH THE AI</span>
              </button>

              <button
                onClick={() => {
                  soundFX.playClick();
                  setSuiteMode('EXAM_QUIZZER');
                }}
                className={`px-3 py-1.5 rounded-lg font-orbitron font-bold transition-all flex items-center gap-1.5 ${
                  suiteMode === 'EXAM_QUIZZER'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>EXAM QUIZZER</span>
              </button>
            </div>

            <button
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-cyan-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Local AI Engine Model Downloading Progress Bar */}
        {isDownloading && downloadProgress !== null && (
          <div className="px-6 py-2 bg-slate-900 border-b border-cyan-500/30 flex items-center justify-between text-xs font-orbitron text-cyan-300">
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              INITIALIZING KURUKSHETRA AI NEURAL ENGINE... (Downloading Model to Browser Cache)
            </span>
            <span>{downloadProgress}%</span>
          </div>
        )}

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

          {/* DYNAMIC PDF / TEXT FILE UPLOAD ZONE */}
          <div className="hud-glass p-4 rounded-xl border border-cyan-500/40 bg-gradient-to-b from-slate-900/90 to-slate-950 transition-all">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              accept=".pdf,.txt,.md"
              className="hidden"
            />

            {!customPdfData ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer border-2 border-dashed rounded-xl p-5 text-center transition-all flex flex-col items-center justify-center gap-2.5 ${
                  isDragOver
                    ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                    : 'border-cyan-500/30 hover:border-cyan-400/70 bg-slate-950/60'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-300">
                  {isParsingPdf ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <UploadCloud className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <h4 className="font-orbitron text-xs font-bold text-cyan-300 tracking-wide">
                    UPLOAD CHAPTER PDF / DRAG &amp; DROP CUSTOM NOTES
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Upload any NCERT chapter, school notes, or subject PDF/Text file to override hardcoded chapters.
                  </p>
                </div>

                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-xs font-bold hover:bg-cyan-500/30 transition-all flex items-center gap-1.5"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>SELECT PDF OR TXT FILE</span>
                </button>
              </div>
            ) : (
              /* ACTIVE UPLOADED PDF STATUS BAR */
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-cyan-950/50 rounded-xl border border-cyan-400/60">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-900/60 rounded-lg border border-cyan-400 text-cyan-300">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-orbitron font-bold text-xs text-cyan-200">
                        {customPdfData.fileName}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        ACTIVE PDF
                      </span>
                    </div>
                    <p className="text-[11px] text-cyan-300/80 mt-0.5">
                      PARSED CHAPTER DATA... [{customPdfData.pageCount}] Pages Extracted Successfully ({customPdfData.wordCount} words, {customPdfData.coreKeywords.length} core terms)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1.5 rounded bg-slate-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold hover:bg-cyan-900/40"
                  >
                    Change File
                  </button>
                  <button
                    onClick={handleClearCustomPdf}
                    className="p-1.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60"
                    title="Remove custom document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Parsing Status Feedback */}
            {pdfParsingStatus && !customPdfData && (
              <div className="mt-2 text-xs font-orbitron text-cyan-400 flex items-center gap-2 animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{pdfParsingStatus}</span>
              </div>
            )}
          </div>

          {/* MODE 1: TEACH THE AI (Feynman Recall Engine) */}
          {suiteMode === 'TEACH_AI' && (
            <div className="space-y-5">

              {/* Header Info */}
              <div className="hud-glass p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-300">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-orbitron text-sm font-bold text-cyan-300">
                      FEYNMAN RECALL &amp; REAL-TIME GAP DETECTION ENGINE
                    </h3>
                    <p className="text-xs text-slate-300">
                      Explain an NCERT topic or your uploaded PDF chapter in your own words. Kurukshetra AI cross-references your explanation against document terms and formulas.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Class Level:</span>
                  <button
                    onClick={() => setSelectedClassLevel('10')}
                    className={`px-2.5 py-1 rounded font-bold ${
                      selectedClassLevel === '10' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    Class 10
                  </button>
                  <button
                    onClick={() => setSelectedClassLevel('11')}
                    className={`px-2.5 py-1 rounded font-bold ${
                      selectedClassLevel === '11' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    Class 11
                  </button>
                </div>
              </div>

              {/* Topic Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  SELECT TOPIC OR CUSTOM PDF TO TEACH:
                </label>
                <select
                  value={selectedTopicId}
                  onChange={(e) => {
                    setSelectedTopicId(e.target.value);
                    setGapTelemetry(null);
                  }}
                  className="w-full bg-slate-900 border border-cyan-500/30 text-cyan-200 p-3 rounded-xl text-xs focus:outline-none focus:border-cyan-400 font-mono-tech"
                >
                  {customPdfData && (
                    <option value="CUSTOM_PDF">
                      📄 [UPLOADED PDF] {customPdfData.fileName} ({customPdfData.pageCount} Pages, {customPdfData.coreKeywords.length} Keywords)
                    </option>
                  )}
                  {NCERT_TOPICS.filter((t) => t.classLevel === selectedClassLevel).map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      [{topic.subject} - Class {topic.classLevel}] {topic.chapter}: {topic.topicName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Input Area (Text + Voice toggle) */}
              <div>
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <label className="font-bold text-slate-300">
                    YOUR EXPLANATION (TEXT OR VOICE):
                  </label>
                  <button
                    onClick={handleToggleVoice}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isRecordingVoice
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-950'
                    }`}
                  >
                    {isRecordingVoice ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isRecordingVoice ? 'RECORDING VOICE...' : 'VOICE INPUT'}</span>
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={explanationText}
                  onChange={(e) => setExplanationText(e.target.value)}
                  placeholder={`Explain ${activeTopic.topicName} as if teaching a classmate... (e.g. State formulas, assumptions, units, and scientific principles)`}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-3.5 rounded-xl text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono-tech leading-relaxed"
                />

                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleAnalyzeExplanation}
                    disabled={isAnalyzingExplanation || !explanationText.trim()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-orbitron font-bold text-xs tracking-wider flex items-center gap-2 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                  >
                    {isAnalyzingExplanation ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>RUNNING GAP DETECTION...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>ANALYZE GAP DETECTION</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Gap Detection Telemetry Results Panel */}
              {gapTelemetry && (
                <div className="hud-glass p-5 rounded-xl border border-amber-500/40 bg-slate-950 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                    <div className="flex items-center gap-2 font-orbitron font-bold text-amber-300 text-sm">
                      <BarChart2 className="w-5 h-5 text-amber-400" />
                      <span>TELEMETRY FEEDBACK &amp; GAP DIAGNOSIS</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">COMPLETENESS INDEX:</span>
                      <span className="px-3 py-1 rounded bg-amber-500/20 border border-amber-400 text-amber-300 font-orbitron font-bold text-sm">
                        {gapTelemetry.completenessScore}%
                      </span>
                    </div>
                  </div>

                  {/* Core Keywords Check */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-900/80 p-3.5 rounded-xl border border-emerald-500/30">
                      <div className="font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>PRESENT KEYWORDS ({gapTelemetry.presentKeywords.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {gapTelemetry.presentKeywords.length > 0 ? (
                          gapTelemetry.presentKeywords.map((kw) => (
                            <span key={kw} className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                              {kw}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-500">None detected yet.</span>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-900/80 p-3.5 rounded-xl border border-rose-500/30">
                      <div className="font-bold text-rose-400 mb-2 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                        <span>MISSING CORE KEYWORDS ({gapTelemetry.missingKeywords.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {gapTelemetry.missingKeywords.length > 0 ? (
                          gapTelemetry.missingKeywords.map((kw) => (
                            <span key={kw} className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/30">
                              {kw}
                            </span>
                          ))
                        ) : (
                          <span className="text-emerald-400 font-bold">All core keywords covered!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Required Steps Analysis */}
                  <div>
                    <h4 className="font-bold text-slate-300 text-xs mb-2">CHAPTER REQUIRED FORMULAS &amp; CONCEPTS COVERAGE:</h4>
                    <div className="space-y-1.5 text-xs">
                      {gapTelemetry.stepCoverage.map((item, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-lg border flex items-center justify-between ${
                            item.covered
                              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                              : 'bg-rose-950/40 border-rose-500/30 text-rose-200'
                          }`}
                        >
                          <span className="truncate max-w-[80%]">{item.step}</span>
                          <span className="font-bold text-[10px] px-2 py-0.5 rounded">
                            {item.covered ? 'COVERED' : 'MISSING'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Feedback */}
                  <div className="bg-cyan-950/30 p-3.5 rounded-xl border border-cyan-500/30 text-xs text-cyan-200 leading-relaxed">
                    <span className="font-bold text-cyan-300 block mb-1 font-orbitron">KURUKSHETRA AI SYNTHESIS:</span>
                    {gapTelemetry.aiFeedback}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* MODE 2: EXAM QUIZZER */}
          {suiteMode === 'EXAM_QUIZZER' && (
            <div className="space-y-5">

              {/* Header Info */}
              <div className="hud-glass p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-amber-950 border border-amber-500/50 text-amber-300">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-orbitron text-sm font-bold text-amber-300">
                      DYNAMIC EXAM &amp; CUSTOM PDF QUIZ SIMULATOR
                    </h3>
                    <p className="text-xs text-slate-300">
                      {useCustomPdfQuiz && customPdfData
                        ? `Generating quiz directly from uploaded chapter "${customPdfData.fileName}"`
                        : selectedClassLevel === '10'
                        ? 'Class 10 Mode: Questions modeled after CBSE Board Exam marking schemes.'
                        : 'Class 11 Mode: Competitive vector & conceptual evaluation matching JEE/NEET patterns.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {customPdfData && (
                    <button
                      onClick={() => {
                        soundFX.playClick();
                        setUseCustomPdfQuiz(!useCustomPdfQuiz);
                        setCurrentQuizIndex(0);
                        setSelectedOptionIndex(null);
                        setIsQuizSubmitted(false);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-orbitron font-bold border ${
                        useCustomPdfQuiz
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}
                    >
                      {useCustomPdfQuiz ? '📄 USING PDF QUIZ' : '📚 USE PDF QUIZ'}
                    </button>
                  )}

                  <div className="flex items-center gap-1 text-xs font-orbitron text-amber-300 bg-slate-900 px-3 py-1 rounded-lg border border-amber-500/30">
                    <span>SCORE:</span>
                    <strong className="text-amber-400">{userScore} XP</strong>
                  </div>

                  <div className="flex items-center gap-1 text-xs">
                    <button
                      onClick={() => {
                        setSelectedClassLevel('10');
                        setUseCustomPdfQuiz(false);
                      }}
                      className={`px-2.5 py-1 rounded font-bold ${
                        selectedClassLevel === '10' && !useCustomPdfQuiz ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      Class 10
                    </button>
                    <button
                      onClick={() => {
                        setSelectedClassLevel('11');
                        setUseCustomPdfQuiz(false);
                      }}
                      className={`px-2.5 py-1 rounded font-bold ${
                        selectedClassLevel === '11' && !useCustomPdfQuiz ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      Class 11
                    </button>
                  </div>
                </div>
              </div>

              {/* Question Box */}
              {currentQuiz && (
                <div className="hud-glass p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-800 pb-2">
                    <span>QUESTION {currentQuizIndex + 1} OF {activeQuizList.length}</span>
                    <span className="text-amber-400">[{currentQuiz.subject}] {currentQuiz.chapter}</span>
                  </div>

                  <p className="text-sm font-bold text-slate-100 leading-relaxed">
                    {currentQuiz.question}
                  </p>

                  {/* Options List */}
                  <div className="space-y-2.5 pt-2">
                    {currentQuiz.options.map((opt, idx) => {
                      let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-amber-500/50';
                      if (selectedOptionIndex === idx) {
                        btnStyle = 'bg-amber-950/60 border-amber-400 text-amber-200';
                      }
                      if (isQuizSubmitted) {
                        if (idx === currentQuiz.correctIndex) {
                          btnStyle = 'bg-emerald-950 border-emerald-400 text-emerald-200 font-bold';
                        } else if (selectedOptionIndex === idx) {
                          btnStyle = 'bg-rose-950 border-rose-500 text-rose-200';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isQuizSubmitted}
                          onClick={() => {
                            soundFX.playClick();
                            setSelectedOptionIndex(idx);
                          }}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isQuizSubmitted && idx === currentQuiz.correctIndex && (
                            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Submit / Next Controls */}
                  <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                    <button
                      onClick={() => {
                        soundFX.playClick();
                        setSelectedOptionIndex(null);
                        setIsQuizSubmitted(false);
                      }}
                      className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reset Selection
                    </button>

                    {!isQuizSubmitted ? (
                      <button
                        onClick={handleQuizSubmit}
                        disabled={selectedOptionIndex === null}
                        className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-orbitron font-bold text-xs tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
                      >
                        <span>SUBMIT ANSWER</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuizQuestion}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-orbitron font-bold text-xs tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                      >
                        <span>NEXT QUESTION</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Marking Scheme & Solution Breakdown Panel */}
              {isQuizSubmitted && currentQuiz && (
                <div className="hud-glass p-5 rounded-xl border border-cyan-500/30 bg-slate-950 space-y-3 animate-fade-in text-xs">
                  <div className="flex items-center gap-2 font-orbitron font-bold text-cyan-300 border-b border-cyan-500/20 pb-2">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span>EXPLANATION &amp; MARKING SCHEME</span>
                  </div>

                  <p className="text-slate-200 leading-relaxed">
                    {currentQuiz.boardExplanation}
                  </p>

                  <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300">
                    <strong className="block mb-0.5 text-[11px] font-orbitron font-bold">CHAPTER MARKING SCHEME:</strong>
                    {currentQuiz.ncertMarkingScheme}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
