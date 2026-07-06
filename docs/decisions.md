# Architectural Decisions Record (ADR)

## ADR 1: Unified Parser Subsystem
- **Status**: Approved.
- **Context**: Different document formats require specialized processing logic.
- **Decision**: Define a single interface for document parsing and instantiate specific engines (EPUB, PDF, TXT) underneath.

## ADR 2: Decoupled Reading Engine
- **Status**: Approved.
- **Context**: Keep the core RSVP engine separate from React component state for portability and performance (60FPS target).
- **Decision**: Core RSVP logic resides in pure TypeScript modules (`playback.ts`, `queue.ts`, `timing.ts`, `orp.ts`).
