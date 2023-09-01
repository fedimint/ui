/// <reference types='react-scripts' />

// Fonts are handled by react-scripts as well
declare module '*.ttf' {
  const src: string;
  export default src;
}
