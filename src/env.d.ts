// src/env.d.ts
/// <reference types="@sveltejs/kit" />

declare module "$env/static/private" {
  export const EMAIL: string;
  export const PASSWORD: string;
  export const PB_URL: string;
  export const GEMINI_API_KEY: string;
}
