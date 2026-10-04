/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional: your own serverless endpoint that generates quotes.
      The endpoint holds the AI API key — never this bundle. */
  readonly VITE_QUOTE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
