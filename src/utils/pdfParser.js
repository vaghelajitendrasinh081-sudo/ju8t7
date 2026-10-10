import * as pdfjsLib from 'pdfjs-dist';

// Set worker source for pdfjs-dist
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
}

/**
 * Common English stop words to filter out when extracting core keywords.
 */
const STOP_WORDS = new Set([
  'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'in', 'to', 'of', 'for', 'with', 'by', 'about', 'against',
  'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'from', 'up', 'down', 'out', 'off',
  'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any',
  'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
  'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now', 'this', 'that', 'these', 'those', 'are', 'was',
  'were', 'been', 'being', 'have', 'has', 'had', 'having', 'does', 'did', 'doing', 'would', 'could', 'their', 'them',
  'they', 'what', 'which', 'who', 'whom', 'its', 'itself', 'your', 'yours', 'we', 'our', 'us'
]);

/**
 * Extracts raw text and page count from a PDF ArrayBuffer or Text file.
 */
export async function parseDocumentFile(file) {
  if (!file) throw new Error('No file provided');

  let fullText = '';
  let pageCount = 1;

  const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');

  if (isPdf) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      pageCount = pdf.numPages || 1;

      let extractedPages = [];
      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(' ');
        extractedPages.push(pageText);
      }
      fullText = extractedPages.join('\n\n');
    } catch (err) {
      console.warn('PDF.js parsing failed or fallback needed:', err);
      // Fallback: Read as raw text if PDF parsing hits worker issue
      fullText = await readAsTextFallback(file);
      pageCount = Math.max(1, Math.ceil(fullText.length / 2500));
    }
  } else {
    // Text/Markdown file
    fullText = await readAsTextFallback(file);
    pageCount = Math.max(1, Math.ceil(fullText.length / 2000));
  }

  // Clean and normalize text
  fullText = fullText.replace(/\s+/g, ' ').trim();
  if (!fullText) {
    fullText = `Chapter Document: ${file.name}\nSample content extracted from uploaded file.`;
  }

  const wordCount = fullText.split(/\s+/).filter(Boolean).length;
  const coreKeywords = extractKeywords(fullText);
  const formulas = extractFormulas(fullText);
  const keyDefinitions = extractDefinitions(fullText);
  const generatedQuizzes = generateQuizzesFromText(fullText, coreKeywords, file.name);

  return {
    fileName: file.name,
    pageCount,
    wordCount,
    fullText,
    coreKeywords,
    formulas,
    keyDefinitions,
    generatedQuizzes
  };
}

function readAsTextFallback(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result || '');
    reader.onerror = () => resolve('');
    reader.readAsText(file);
  });
}

function extractKeywords(text) {
  const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const freqMap = {};
  words.forEach((w) => {
    if (!STOP_WORDS.has(w)) {
      freqMap[w] = (freqMap[w] || 0) + 1;
    }
  });

  return Object.keys(freqMap)
    .sort((a, b) => freqMap[b] - freqMap[a])
    .slice(0, 12);
}

function extractFormulas(text) {
  // Regex for formulas / equations with operators =, +, -, *, /, ^ or symbols
  const sentences = text.split(/[.!?\n]+/);
  const formulaMatches = [];

  for (const s of sentences) {
    const trimmed = s.trim();
    if (
      trimmed.length > 3 &&
      trimmed.length < 80 &&
      (/[=><+\-*/^]|\\frac|sin|cos|tan|log|E=|\b\d+[a-zA-Z]/i.test(trimmed))
    ) {
      formulaMatches.push(trimmed);
    }
  }

  return formulaMatches.slice(0, 5);
}

function extractDefinitions(text) {
  const sentences = text.split(/[.!?\n]+/);
  const defs = [];

  for (const s of sentences) {
    const trimmed = s.trim();
    if (
      trimmed.length > 20 &&
      trimmed.length < 200 &&
      (/\bis defined as\b|\bis the process of\b|\brefers to\b|\bis called\b|\bstate[s]? that\b/i.test(trimmed))
    ) {
      defs.push(trimmed);
    }
  }

  return defs.slice(0, 5);
}

function generateQuizzesFromText(text, keywords, fileName) {
  const sentences = text
    .split(/[.!?\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 30 && s.length < 220);

  const quizList = [];

  for (let i = 0; i < Math.min( sentences.length, 5 ); i++) {
    const sentence = sentences[i];
    // Find a keyword in sentence
    const matchedKw = keywords.find((kw) => sentence.toLowerCase().includes(kw.toLowerCase())) || keywords[0] || 'concept';

    // Blank out the keyword in question
    const regex = new RegExp(`\\b${matchedKw}\\b`, 'gi');
    const questionText = `According to "${fileName}", fill in the key term: "${sentence.replace(regex, '________')}"`;

    const correctAnswer = matchedKw.charAt(0).toUpperCase() + matchedKw.slice(1);
    const distractor1 = keywords[(i + 1) % keywords.length] || 'Parameter';
    const distractor2 = keywords[(i + 2) % keywords.length] || 'Variable';
    const distractor3 = keywords[(i + 3) % keywords.length] || 'Constant';

    const rawOptions = [
      correctAnswer,
      distractor1.charAt(0).toUpperCase() + distractor1.slice(1),
      distractor2.charAt(0).toUpperCase() + distractor2.slice(1),
      distractor3.charAt(0).toUpperCase() + distractor3.slice(1)
    ];

    // Deduplicate options if any are repeated
    const options = Array.from(new Set(rawOptions));
    while (options.length < 4) {
      options.push(`Option ${options.length + 1}`);
    }

    const correctIndex = options.indexOf(correctAnswer);

    quizList.push({
      subject: 'CUSTOM PDF',
      chapter: fileName.substring(0, 24),
      question: questionText,
      options,
      correctIndex,
      boardExplanation: `Extracted directly from page content of "${fileName}": "${sentence}"`,
      ncertMarkingScheme: `1 Mark: Identifying correct key term "${correctAnswer}" derived from custom chapter text.`
    });
  }

  // Fallback if no sentences extracted
  if (quizList.length === 0) {
    quizList.push({
      subject: 'CUSTOM PDF',
      chapter: fileName.substring(0, 24),
      question: `What is the primary subject focus discussed in "${fileName}"?`,
      options: [
        keywords[0] ? keywords[0].toUpperCase() : 'CORE PRINCIPLES',
        'HYPOTHETICAL ANALYSIS',
        'UNSPECIFIED TOPIC',
        'GENERAL SYSTEM THEORY'
      ],
      correctIndex: 0,
      boardExplanation: `Primary topic analyzed from document keywords: ${keywords.join(', ')}.`,
      ncertMarkingScheme: '1 Mark for core term identification.'
    });
  }

  return quizList;
}
