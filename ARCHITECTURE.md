# 🏗️ CodeSage Architecture

This document describes the technical architecture, system design principles, data pipelines, and AI orchestration model behind the CodeSage platform.

---

# 🌟 System Overview

CodeSage is an autonomous AI-powered DevSecOps platform designed to analyze enterprise-scale codebases, correlate findings with live web threat intelligence, and determine deployment readiness in real time.

The platform is architected as a decoupled, multi-agent intelligence system unified under a single deployable Node.js/Express application.

CodeSage combines:

* AI-powered code reasoning
* real-time cybersecurity intelligence
* deployment risk analysis
* live web vulnerability correlation
* autonomous remediation workflows

to function as an enterprise CI/CD deployment gatekeeper.

---

# 🎯 Architectural Goals

The system was designed around the following engineering goals:

* Real-time AI-powered security analysis
* Scalable multi-repository processing
* Live web threat intelligence integration
* Enterprise-ready CI/CD compatibility
* Deterministic AI outputs
* Low-latency realtime frontend updates
* Modular agent orchestration
* Production-grade deployment simplicity

---

# 📐 High-Level Architecture Diagram

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                            CodeSage Unified Platform                         │
└──────────────────────────────────────────────────────────────────────────────┘


        ┌──────────────────────────── FRONTEND ────────────────────────────┐

        ┌──────────────────────────────────────────────────────────────────┐
        │                         React 18 + Vite                         │
        │------------------------------------------------------------------│
        │ • Dashboard & Risk Visualizations                               │
        │ • Repository Upload Interface                                   │
        │ • Live Scanner Overlay                                           │
        │ • AI Reasoning Feed                                               │
        │ • Deployment Verdict Panel                                        │
        │ • Realtime Security Metrics                                       │
        └───────────────────────▲──────────────────────────────────────────┘
                                │
                                │ HTTP + Realtime Events
                                │
        ┌───────────────────────┴──────────────────────────────────────────┐
        │                     Express Unified Backend                       │
        │------------------------------------------------------------------│
        │ • REST API Layer                                                  │
        │ • Static Frontend Hosting                                         │
        │ • Webhook Endpoints                                               │
        │ • Repository Ingestion                                            │
        │ • Authentication Middleware                                       │
        │ • Scan Orchestration                                              │
        └───────────────────────▲──────────────────────────────────────────┘
                                │
                                │ Async Scan Jobs
                                │
        ┌───────────────────────┴──────────────────────────────────────────┐
        │                    Multi-Agent Orchestrator                       │
        │------------------------------------------------------------------│
        │ • Code Analyzer Agent                                             │
        │ • Dependency Audit Agent                                          │
        │ • Threat Intelligence Agent                                       │
        │ • Auto-Fix Generation Agent                                       │
        │ • Deployment Verdict Engine                                       │
        └───────────────┬──────────────────────────────┬───────────────────┘
                        │                              │
                        │                              │
          ┌─────────────▼─────────────┐   ┌────────────▼────────────┐
          │        OpenRouter         │   │       Bright Data        │
          │---------------------------│   │---------------------------│
          │ • Llama 3.1               │   │ • SERP API               │
          │ • Mistral                 │   │ • Web Unlocker           │
          │ • DeepSeek                │   │ • Scraping Browser       │
          │ • Structured JSON Output  │   │ • Live Web Intelligence  │
          └─────────────┬─────────────┘   └────────────┬────────────┘
                        │                              │
                        └──────────────┬───────────────┘
                                       │
                        ┌──────────────▼──────────────┐
                        │     Supabase PostgreSQL      │
                        │------------------------------│
                        │ • Projects                   │
                        │ • Issues                     │
                        │ • Scan Results               │
                        │ • Threat Intelligence        │
                        │ • Deployment Verdicts        │
                        └──────────────▲──────────────┘
                                       │
                                       │ Realtime Broadcast
                                       │
                        ┌──────────────┴──────────────┐
                        │      Supabase Realtime       │
                        │------------------------------│
                        │ • Live Scan Progress         │
                        │ • Threat Alerts              │
                        │ • AI Reasoning Updates       │
                        │ • Deployment Status Events   │
                        └──────────────────────────────┘
```

---

# 🔄 Unified System Data Flow

## 1. Unified Express Architecture

CodeSage uses a unified Node.js/Express deployment architecture.

The backend:

* serves the React/Vite frontend,
* exposes REST APIs,
* handles webhook integrations,
* orchestrates AI agents,
* and streams realtime events.

This architecture:

* eliminates frontend/backend deployment complexity,
* removes CORS overhead,
* simplifies CI/CD pipelines,
* and enables single-container deployment.

---

## 2. Repository Ingestion Pipeline

Repositories can be:

* uploaded as ZIP archives,
* cloned from GitHub,
* or connected through Git URLs.

The ingestion pipeline:

* recursively traverses repositories,
* strips unnecessary directories (`node_modules`, `.git`, binaries, images),
* extracts code files,
* normalizes file structures,
* and prepares optimized AI analysis chunks.

This dramatically:

* reduces token usage,
* improves analysis speed,
* and prevents LLM context overload.

---

## 3. Asynchronous Scan Orchestration

All scans are processed asynchronously using background workers.

This prevents:

* API thread blocking,
* frontend freezing,
* and long-running request failures.

The orchestration engine:

* creates scan jobs,
* distributes workloads to specialized agents,
* tracks progress,
* and streams realtime updates back to the UI.

This architecture enables scalable concurrent repository analysis.

---

# 🤖 Multi-Agent Intelligence Architecture

CodeSage uses a modular multi-agent AI orchestration system.

Each agent specializes in a focused responsibility.

---

## 🔍 Code Analyzer Agent

Responsibilities:

* detect programming languages,
* perform static analysis,
* identify insecure patterns,
* detect runtime risks,
* identify logic vulnerabilities,
* classify severity levels.

The agent produces strict structured JSON outputs validated against predefined schemas.

---

## 📦 Dependency Audit Agent

Responsibilities:

* inspect dependency manifests,
* analyze package versions,
* detect vulnerable dependencies,
* identify deprecated packages,
* cross-reference ecosystem advisories.

Supported ecosystems:

* npm
* PyPI
* Maven
* Composer
* Cargo

---

## 🌐 Threat Intelligence Agent

Responsibilities:

* query live web intelligence,
* correlate findings against CVEs,
* detect active exploits,
* inspect public advisories,
* gather real-time vulnerability context.

Powered by:

* Bright Data SERP API
* Bright Data Web Unlocker
* Bright Data Scraping Browser

Bright Data infrastructure enables:

* resilient scraping,
* CAPTCHA bypassing,
* protected advisory access,
* and large-scale live intelligence gathering.

Without Bright Data, autonomous realtime vulnerability correlation would not be possible at scale.

---

## 🛠️ Auto-Fix Generation Agent

Responsibilities:

* generate remediation patches,
* suggest secure alternatives,
* patch vulnerable code,
* fix insecure configurations,
* maintain syntax correctness.

The system:

* preserves formatting,
* minimizes destructive edits,
* and validates generated outputs before persistence.

---

## 🚦 Deployment Verdict Engine

Responsibilities:

* aggregate scan intelligence,
* calculate platform scores,
* determine deployment readiness.

Generated metrics:

* Security Score
* Reliability Score
* Maintainability Score

Possible verdicts:

* PASS
* WARN
* BLOCK

Critical vulnerabilities automatically trigger deployment blocking.

---

# 🧠 OpenRouter AI Layer

CodeSage utilizes OpenRouter as the primary AI inference gateway.

Advantages:

* model flexibility,
* reduced vendor lock-in,
* access to multiple open-source LLMs,
* scalable routing,
* cost optimization.

Supported models include:

* Llama 3.1
* Mistral
* DeepSeek
* Mixtral

All AI responses:

* use strict JSON schemas,
* are validated before storage,
* and are normalized for deterministic frontend rendering.

This ensures:

* CI/CD compatibility,
* predictable integrations,
* and enterprise-safe outputs.

---

# 🌐 Bright Data Intelligence Layer

Bright Data powers the platform’s live web intelligence infrastructure.

CodeSage leverages:

* SERP API
* Web Unlocker
* Scraping Browser

for:

* CVE discovery,
* exploit correlation,
* vulnerability enrichment,
* advisory scraping,
* protected-source intelligence gathering.

The system continuously cross-references:

* GitHub advisories,
* OWASP references,
* CVE databases,
* npm vulnerabilities,
* PyPI advisories,
* exploit discussions,
* security blogs,
* and public disclosure feeds.

---

# 🗄️ Database Architecture (Supabase)

Supabase PostgreSQL acts as:

* the primary relational database,
* realtime event broadcaster,
* and scan persistence layer.

---

## Core Tables

### `projects`

Stores:

* repository metadata,
* deployment verdicts,
* scan timestamps,
* aggregated scores.

---

### `issues`

Stores:

* vulnerabilities,
* severity,
* file paths,
* remediation suggestions,
* CVE mappings,
* dependency intelligence.

---

### `scan_events`

Stores:

* realtime scan progress,
* AI reasoning events,
* websocket stream updates,
* orchestration logs.

---

# ⚡ Realtime Event System

Supabase Realtime streams:

* scan progress,
* live threat alerts,
* AI reasoning logs,
* deployment status updates,
* vulnerability discoveries

directly into the React frontend.

This powers:

* animated progress bars,
* realtime counters,
* live scan feeds,
* cinematic scanning experiences.

---

# 🎨 Frontend Architecture

The frontend follows a layered React architecture.

---

## Component Architecture

```text
Atoms
 ├── Button
 ├── Input
 ├── Badge

Molecules
 ├── StatsCard
 ├── SeverityBadge
 ├── FileTreeItem

Organisms
 ├── Dashboard
 ├── Scanner
 ├── AnalysisPanel
 ├── LiveScannerOverlay

Templates
 ├── Root Layout

Pages
 ├── Dashboard Page
 ├── Repository Page
 ├── Settings Page
```

---

## Frontend Design Principles

The UI emphasizes:

* cybersecurity aesthetics,
* glassmorphism,
* realtime motion,
* terminal-inspired interfaces,
* cinematic feedback systems.

Animations are powered by:

* Framer Motion
* Realtime streaming events
* Incremental rendering

---

# 🔒 Security Design Principles

CodeSage follows several secure engineering practices:

* strict JSON validation,
* isolated AI outputs,
* sanitized repository ingestion,
* dependency filtering,
* secure environment variable handling,
* webhook verification,
* schema-based persistence validation.

---

# 🚀 Scalability Considerations

The architecture is designed for future scalability through:

* distributed scan workers,
* queue-based orchestration,
* horizontally scalable APIs,
* isolated AI agents,
* event-driven processing,
* realtime streaming pipelines.

Future infrastructure expansion may include:

* Kubernetes orchestration
* Redis queues
* Distributed worker clusters
* AI memory systems
* SOC integrations

---

# 📖 Core Technologies & References

* React 18
* Vite
* Express.js
* Supabase
* OpenRouter
* Bright Data
* TailwindCSS
* Framer Motion
* Monaco Editor
* Recharts

---

# 🏁 Conclusion

CodeSage demonstrates how autonomous AI systems become dramatically more powerful when connected to realtime web intelligence.

By combining:

* AI-powered reasoning,
* live cybersecurity intelligence,
* realtime orchestration,
* and deployment automation,

CodeSage transforms traditional static analysis into a continuously evolving enterprise deployment intelligence platform.
