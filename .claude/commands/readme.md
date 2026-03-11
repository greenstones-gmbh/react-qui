# Generate a comprehensive README.md for providen TypeScript library. Include:

1. **Header** — title, description, badges (npm, license, CI, coverage, TypeScript)
2. **Why this library** — problem it solves (focus on reusable components), key benefits
3. **Installation** — npm, yarn, pnpm
4. **Quick Start** — minimal working example with TypeScript types
5. **API Documentation** — Group api docs by folder structure 'src/lib/CHAPTER'. A TOC table now sits at the top of the API Documentation section with each module name as an anchor link and a short description. For every exported function/class/type:
   - Signature with full TypeScript types
   - Description
   - Parameters table (name | type | required | description)
   - Return type and description
   - Code example
6. **Advanced Usage** — complex patterns, composition, edge cases
7. **TypeScript** — generic types, type utilities, custom type examples
8. **Configuration** — all options with types and defaults table
9. **Error Handling** — error types thrown, how to catch them
10. **Contributing** — setup, test commands, PR guide
11. **Changelog** — link to CHANGELOG.md
12. **License**

Infer everything from the source code. Use accurate, runnable TypeScript examples 
with explicit types throughout. Format API docs consistently."