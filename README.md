# AppGraph Builder 🚀

A high-performance, interactive graph editor for managing service architectures. Build, connect, and monitor your infrastructure nodes in a clean, professional interface.

**Live Demo:** [https://app-graph-builder-woad.vercel.app/](https://app-graph-builder-woad.vercel.app/)

## ✨ Features

- **Interactive Canvas:** Fluid node-based editor powered by ReactFlow.
- **Service Inspector:** Detailed side panel for configuring node properties and viewing runtime metrics.
- **Architecture Linking:** Draw connections between services to define data flow and dependencies.
- **Real-time Status Monitoring:** Visual indicators for service health (Healthy, Degraded, Down).
- **Responsive Design:** Seamless experience from desktop ultrawides to mobile devices.
- **Mock Persistence:** In-memory database with React Query ensures your changes persist within the session.

## 🛠 Tech Stack

- **Framework:** React 19 (Vite)
- **Graph Engine:** ReactFlow
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run development server:**
   ```bash
   npm run dev
   ```
4. **Build for production:**
   ```bash
   npm run build
   ```

## 📝 Design Decisions

Detailed architectural reasoning can be found in the [reasoning.md](./reasoning.md) file. This project focuses on separation of concerns, ensuring the UI remains snappy even as the complexity of the graph grows.
