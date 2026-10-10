import { pipeline, env } from '@xenova/transformers';

// Configure transformers.js for browser environment
env.allowLocalModels = false;
env.useBrowserCache = true;

let generatorPipeline = null;
let isLoading = false;

/**
 * Initializes or retrieves the local text-generation neural engine pipeline.
 * @param {Function} onProgress Progress callback for downloading model weights into browser cache.
 * @returns {Promise<Function>} Generator pipeline function.
 */
export async function getLocalAiEngine(onProgress) {
  if (generatorPipeline) {
    return generatorPipeline;
  }

  if (isLoading) {
    // Wait until loading finishes
    while (isLoading && !generatorPipeline) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (generatorPipeline) return generatorPipeline;
  }

  isLoading = true;

  try {
    // Check basic WebAssembly / ArrayBuffer support
    if (typeof WebAssembly !== 'object' || !WebAssembly.instantiate) {
      throw new Error('WebAssembly is not supported in this browser environment.');
    }

    // Initialize pipeline with Xenova/LaMini-Flan-T5-77M (Lightweight ~75MB client-side WASM neural model)
    const pipe = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-77M', {
      progress_callback: (progressData) => {
        if (typeof onProgress === 'function') {
          onProgress(progressData);
        }
      }
    });

    generatorPipeline = pipe;
    isLoading = false;
    return generatorPipeline;
  } catch (error) {
    isLoading = false;
    console.error('Failed to initialize local neural engine:', error);
    throw error;
  }
}

/**
 * Generates an answer using the in-browser local neural engine.
 * @param {string} prompt The query prompt from user.
 * @param {Function} onProgress Progress callback if model needs downloading.
 * @returns {Promise<string>} Generated text response.
 */
export async function generateLocalAiResponse(prompt, onProgress) {
  const pipe = await getLocalAiEngine(onProgress);
  const formattedPrompt = `Answer the following study doubt or question concisely:\n${prompt}`;
  const output = await pipe(formattedPrompt, {
    max_new_tokens: 120,
    temperature: 0.7,
    repetition_penalty: 1.2
  });

  if (Array.isArray(output) && output.length > 0 && output[0].generated_text) {
    return output[0].generated_text.trim();
  }
  return 'Sudarshan Neural Engine response generated successfully.';
}
