# Spin documentation

Spin is a browser lab for learning active inference. Learners can switch
between conversational activities in Pulse, visual interactives in Vision,
and derivations and retrieval questions in Core.

## Start the lab locally

Install the Node.js version in [`.node-version`](../.node-version). From
the repository root, install the lockfile and launch the development server.

```bash
npm ci
./run.sh dev
```

Open `http://localhost:5173` in a browser. The default `./run.sh` also runs
the Vitest suite before launching. For a production preview with the offline
worker, use `./run.sh preview` and open `http://localhost:4173`.

## Guides

| Guide | What it covers |
| --- | --- |
| [Modules](modules-guide.md) | Curriculum, stream registry, quiz, and glossary integration |
| [Architecture](architecture.md) | Providers, routes, lazy modules, and state |
| [Configuration](configuration.md) | Runtime versions, scripts, local storage, offline bundle, and deployment |
| [Testing](testing.md) | Lint, build, Vitest checks, and Playwright browser verification |
| [Design system](design-system.md) | Tokens, layout, motion, and access |
| [API reference](api-reference.md) | Components, contexts, and helpers |
| [Logging](logging.md) | Diagnostic logging and prefixes |
| [Philosophy](philosophy.md) | Design commitments traced to the original brief |
| [The Seed](initial-pocket-lab-prompt.md) | Original creative brief, preserved as written |
| [Technical manuscript](manuscript/README.md) | Software architecture and evidence, with a pinned render command |
