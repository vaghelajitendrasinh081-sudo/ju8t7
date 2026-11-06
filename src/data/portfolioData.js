export const portfolioData = {
  hero: {
    callsign: "SAHIR",
    headline: "PORTFOLIO",
    greeting: "Hello, I'm SAHIR.",
    role: "SYSTEM ARCHITECT & AUTONOMOUS OPERATOR",
    summary: "Engineering resilient, multi-agent computational systems, high-frequency execution infrastructure, and sovereign autonomous architectures. Specializing in zero-trust distributed backends, LLM consensus topologies, and mathematical modeling.",
    metrics: [
      { label: "REPOSITORIES", value: "473+", detail: "Autonomous & System Codebases" },
      { label: "STACK DEPTH", value: "7-LAYER", detail: "End-to-End Autonomy" },
      { label: "UPTIME TARGET", value: "100%", detail: "Deterministic Fault Isolation" },
      { label: "CODE SHIPPED", value: "300k+", detail: "Rust, Python, Go & TypeScript" },
    ],
    statusPills: [
      { label: "Autonomous Core", status: "STABLE 0.04ms" },
      { label: "SaaS Lab Takeover", status: "ACTIVE RUNTIME" }
    ]
  },
  ethos: [
    {
      id: "first-principles",
      title: "First-Principles Architecture",
      subtitle: "Deterministic Zero-Trust Foundations",
      code: "ETHOS_01",
      icon: "Cpu",
      description: "Deconstructing systems into foundational thermodynamic and computational primitives. We eliminate abstraction bloat to guarantee deterministic latency, provable concurrency, and non-blocking I/O pipelines.",
      highlights: ["Zero-dependency micro-kernels", "O(1) memory layouts", "Hardware-tailored vectorization"]
    },
    {
      id: "automatic-verification",
      title: "Automatic Verification",
      subtitle: "Formal Proofs & Mathematical Guarantees",
      code: "ETHOS_02",
      icon: "ShieldCheck",
      description: "Every line of execution is mathematically bounded. Continuous invariance testing, property-based fuzzing, and static symbolic execution replace heuristic unit testing to guarantee zero state leakage.",
      highlights: ["Formal TLA+ state-machine specs", "Continuous symbolic fuzzing", "Atomic state rollback"]
    },
    {
      id: "autonomous-execution",
      title: "Autonomous Execution",
      subtitle: "Self-Healing Distributed Multi-Agents",
      code: "ETHOS_03",
      icon: "Terminal",
      description: "Deploying self-arbitrating multi-LLM councils and autonomous cron operators that monitor invariants, auto-remediate partition splits, and execute low-latency arbitrage across distributed networks.",
      highlights: ["Byzantine fault-tolerant voting", "Sub-millisecond trigger rings", "Self-refining prompt & model routing"]
    }
  ],
  flagship: {
    title: "SAAI — 7-Layer Autonomous AI Ecosystem",
    badge: "MISSION-CRITICAL FLAGSHIP",
    description: "An industrial-grade, fully sovereign autonomous intelligence framework engineered to ingest distributed telemetric feeds, simulate multi-scenario futures via a parliament of specialized neural models, and autonomously trigger deterministic multi-chain or systems-level execution.",
    stats: {
      stars: "2.4k+",
      forks: "380+",
      subscribers: "12k+",
      latency: "1.2ms p99"
    },
    layers: [
      {
        id: "L00",
        name: "Layer 00: Foundation & Invariance",
        role: "Low-level rust runtimes, memory pools, and formal algebraic invariants.",
        tech: ["Rust", "eBPF", "SIMD", "jemalloc"],
        metric: "< 120ns Memory Allocation",
        overview: "Hardware-level memory layout control, ring buffers, and cache-line aligned structures providing the foundational zero-allocation sandbox."
      },
      {
        id: "L01",
        name: "Layer 01: Multi-Modal Ingestion Mesh",
        role: "Distributed Kafka & WebSocket firehose normalizing cross-asset ticker feeds & unformatted telemetry.",
        tech: ["Apache Kafka", "WebSockets", "Protobuf", "gRPC"],
        metric: "1.8M msg/sec throughput",
        overview: "Zero-copy streaming pipeline that ingests continuous market depth, GitHub operational hooks, and raw sensor telemetries."
      },
      {
        id: "L02",
        name: "Layer 02: Cognitive Parliament Topology",
        role: "Consensus protocol orchestrating 9 heterogeneous LLMs with adversarial verification.",
        tech: ["Claude 3.7", "DeepSeek-R1", "GPT-4o", "Ollama Cluster"],
        metric: "99.98% Fact Alignment",
        overview: "Instead of single-model vulnerability, queries pass through a constitutional adversarial debate matrix where hallucinated assertions are vetoed in real time."
      },
      {
        id: "L03",
        name: "Layer 03: Dynamical Latent Simulator",
        role: "Monte Carlo & Neural ODE forecasting of market impact and operational risk trajectories.",
        tech: ["PyTorch", "CUDA", "JAX", "DifferentialEquations.jl"],
        metric: "50,000 simulations / sec",
        overview: "Simulates probabilistic state trajectories prior to committing capital or triggering high-privilege infrastructure state changes."
      },
      {
        id: "L04",
        name: "Layer 04: Execution & Liquidity Engine",
        role: "Non-blocking order router with hardware timestamping and flash loan integration.",
        tech: ["Solidity", "Foundry", "Go FastPath", "MEV-Boost"],
        metric: "14ms execution latency",
        overview: "Atomic transaction bundler guaranteeing zero front-running vulnerability and zero-revert gas reclamation algorithms."
      },
      {
        id: "L05",
        name: "Layer 05: Sovereign Verification Fabric",
        role: "Post-execution cryptographic auditing, zero-knowledge proofs, and invariant reconcilers.",
        tech: ["ZK-SNARKs", "Circom", "PostgreSQL", "ClickHouse"],
        metric: "100% Cryptographic Audit Trail",
        overview: "Generates immutable cryptographic proofs of every execution event, allowing auditability without exposing confidential transaction strategies."
      },
      {
        id: "L06",
        name: "Layer 06: Autonomous Agent Mesh",
        role: "Decentralized task distribution, autonomous cron daemons, and automated PR synthesis.",
        tech: ["TypeScript", "LangChain", "Temporal.io", "Docker Swarm"],
        metric: "47 Autonomous Daemons Live",
        overview: "Autonomous agents that monitor production errors, write unit test patches, open pull requests, and deploy verification builds autonomously."
      }
    ],
    subProjects: [
      {
        id: "flash-lab",
        title: "Flash_Lab — Arbitrage Engine",
        category: "DEFI & QUANT",
        tag: "PRODUCTION LIVE",
        description: "Sub-millisecond cross-DEX spatial and triangular arbitrage routing engine with automated flash-loan sizing and atomic bundle simulation.",
        metrics: ["14ms Execution Speed", "$42M+ Simulated Volume", "Zero-Revert Safeguards"],
        stack: ["Rust", "Foundry", "EVM Bytecode", "WebSocket"]
      },
      {
        id: "biller",
        title: "Biller — Offline-First Invoicing",
        category: "DISTRIBUTED SYSTEMS",
        tag: "OPEN SOURCE",
        description: "Zero-latency, air-gapped enterprise invoicing system with CRDT-based multi-device synchronization and automated tax compliance matrices.",
        metrics: ["Zero Server Dependency", "100% Offline Capability", "Instant PDF Gen"],
        stack: ["React", "TypeScript", "IndexedDB", "WebAssembly"]
      },
      {
        id: "quant-models",
        title: "Quantitative Models — Volatility Surface",
        category: "MATHEMATICAL COMPUTING",
        tag: "RESEARCH & DEPLOYED",
        description: "Continuous stochastic volatility surface calibrator using Heston and SABR parametric models calibrated to live option chain order books.",
        metrics: ["0.002 RMSE Fit", "Real-Time Calibration", "CUDA Parallelized"],
        stack: ["Python", "CUDA C++", "NumPy", "Numba"]
      }
    ]
  },
  matrix: [
    {
      id: "multi-llm",
      title: "Multi-LLM Parliament Architecture",
      status: "PRODUCTION CORE",
      tag: "AI/ML SYSTEMS",
      abstract: "A constitutional tri-cameral consensus protocol where primary generative LLMs draft proposals, formal verification models cross-check logic, and adversarial red-team models search for edge vulnerabilities before output authorization.",
      tech: ["Claude 3.7", "DeepSeek-R1", "Python", "FastAPI", "VectorDB"],
      github: "https://github.com/vaghelajitendrasinh081-sudo",
      metrics: "9 Models In Council • 180ms Round-Trip"
    },
    {
      id: "ait-kronos",
      title: "AIT-KRONOS — ML Time-Series Forecaster",
      status: "STABLE v3.2",
      tag: "QUANTITATIVE",
      abstract: "Multi-horizon transformer-based temporal forecaster combining Fourier neural operators with sparse attention mechanisms to predict high-volatility financial timeseries with calibrated confidence bounds.",
      tech: ["PyTorch", "CUDA", "Temporal Fusion", "TimescaleDB"],
      github: "https://github.com/vaghelajitendrasinh081-sudo",
      metrics: "32 Lookback Horizons • 0.88 Directional Accuracy"
    },
    {
      id: "dlpm",
      title: "DLPM — Dynamical Latent Field Model",
      status: "RESEARCH ACTIVE",
      tag: "DEEP TECH",
      abstract: "Continuous-depth neural ordinary differential equations (Neural ODE) mapping chaotic market phase spaces to low-dimensional smooth Riemannian manifolds for invariant regime detection.",
      tech: ["JAX", "Diffrax", "Equinox", "GPU Clusters"],
      github: "https://github.com/vaghelajitendrasinh081-sudo",
      metrics: "Runge-Kutta 4th-Order Solver • Latent Dim: 16"
    },
    {
      id: "gpu-crypto",
      title: "GPU-Accelerated Cryptographic Search",
      status: "HARDWARE ACCELERATED",
      tag: "CRYPTOGRAPHY",
      abstract: "Massively parallelized vanity key generation and elliptic curve point scalar multiplication exploiting custom PTX assembly and warp-level primitives on NVIDIA Hopper/Ada architectures.",
      tech: ["CUDA C++", "PTX Assembly", "secp256k1", "OpenCL"],
      github: "https://github.com/vaghelajitendrasinh081-sudo",
      metrics: "8.4 Billion Keys/sec on RTX 4090"
    },
    {
      id: "hedge-fund",
      title: "Hedge Fund Structure & Institutional Design",
      status: "ARCHITECTURAL BLUEPRINT",
      tag: "FINANCIAL ARCHITECTURE",
      abstract: "Comprehensive quantitative asset management architecture encompassing prime-brokerage FIX APIs, sub-account portfolio isolation, automated risk kill-switches, and algorithmic fee-watermark ledgers.",
      tech: ["FIX 4.4", "PostgreSQL", "Docker", "Prometheus", "Grafana"],
      github: "https://github.com/vaghelajitendrasinh081-sudo",
      metrics: "Zero-Overrun Risk Caps • Sub-second FIX Link"
    }
  ],
  bio: {
    formal: "Bachelor of Computer Applications (BCA) with specialized emphasis on Distributed Operating Systems, Concurrent Computation, and Algorithmic Complexity.",
    statement: "I operate at the intersection of deep-tech engineering and autonomous intelligence. My work strips away superfluous enterprise layers in favor of raw computational efficiency, zero-latency execution loops, and provable mathematical guarantees. Over 473+ systems repositories engineered with uncompromising focus on sovereignty and deterministic runtime behaviors.",
    competencies: [
      { category: "Autonomous Systems", skills: ["Multi-Agent Orchestration", "Constitutional LLM Routing", "Self-Healing Cron Meshes", "Agentic Tool Calling"] },
      { category: "High Performance Computing", skills: ["Rust Concurrency", "CUDA / PTX Optimization", "SIMD Vectorization", "Linux Kernel Tuning & eBPF"] },
      { category: "Quantitative & DeFi", skills: ["Cross-DEX Arbitrage", "Flash-Loan Orchestration", "Stochastic Volatility", "HFT Order Books"] },
      { category: "Core Infrastructure", skills: ["Distributed Consensus", "Kafka Event Sourcing", "Docker / Swarm Clustering", "Zero-Knowledge Proofs"] }
    ]
  },
  contact: {
    email: "sahir.architect@autonomous.systems",
    github: "https://github.com/vaghelajitendrasinh081-sudo",
    twitter: "https://x.com/sahir_systems",
    linkedin: "https://linkedin.com/in/sahir-architect"
  }
};
