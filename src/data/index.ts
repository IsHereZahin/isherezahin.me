// src/data/index.ts
//
// The site's static content layer.
//
//   types.ts   shared shapes for everything below
//   site.ts    site-wide data (themes, languages)
//   pages/     one module per static page — see `pages/index.ts`
//
// These values are compiled into the build: no database, no client fetching.
// Blogs and projects are the deliberate exception and stay database-driven.

export * from "./pages";
export * from "./site";
export * from "./types";
