# High-Throughput Telemetry & Edge Observability Dashboard

A high-performance real-time telemetry ingestion and stream observability platform built with **Next.js**, **TypeScript**, and **Tailwind CSS**. Designed to handle high-frequency time-series data streams without compromising UI framerates or browser DOM performance.

![Telemetry Dashboard Preview](https://raw.githubusercontent.com/placeholder/preview.png)

---

## Key Architectural Features

* **DOM Virtualization (`react-window`)**: Renders thousands of real-time incoming events while maintaining a static memory footprint and $O(1)$ active DOM nodes.
* **Native SVG Time-Series Sparklines**: Sub-millisecond rendering of real-time latency trend dynamics without external charting library overhead.
* **Edge Anomaly Detection Engine**: Automated stream monitoring that flags latency spikes (>2.0 ms) and ingestion packet loss in real-time.
* **Granular Node Diagnostics**: Interactive diagnostic modal revealing raw JSON spatial headers (`lidar_points_ingested`, sector IDs) per edge device.
* **Client-Side Buffer Exporter**: Instant client-side CSV export of the buffered event stream for offline telemetry analysis.

---

## Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Virtualization** | `react-window` |
| **Icons** | Lucide React |

---

## Performance Optimizations

1. **State Virtualization**: Buffered event logs are capped to a sliding window of 5,000 items in memory to prevent browser heap inflation.
2. **CJS/ESM Turbopack Compatibility**: Dynamic module resolution for `react-window` to supportNext.js Turbopack compilation seamlessly.
3. **Zero-Dependency SVG Graphics**: Lightweight vector paths for real-time data visualizers to guarantee 60 FPS UI performance.

---

## Local Setup

### Prerequisites
* Node.js 18+ 
* npm or pnpm

### Installation

```bash
# Clone repository
git clone [https://github.com/your-username/high-throughput-dashboard.git](https://github.com/your-username/high-throughput-dashboard.git)
cd high-throughput-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
