# Architectural Reasoning

This project was built to demonstrate a highly responsive, professional-grade node-based editor for infrastructure management. Below are the key technical decisions made during development:

### 1. State Management Strategy
I opted for a hybrid state approach:
- **ReactFlow Internal State:** Handles node positions and edge connections directly for maximum performance during drag/drop.
- **Zustand:** Used for global UI state (like `selectedAppId`, `isMobilePanelOpen`). It provides a lightweight, performant way to sync state across the sidebar, header, and canvas without prop-drilling.
- **TanStack Query:** Manages the data layer. It handles caching, loading states, and provides the mechanism for "persisting" changes to our mock DB with optimistic UI updates.

### 2. Custom Node Architecture
Instead of standard nodes, I implemented a `ServiceNode` component. This allows for:
- **Rich Metadata Visualization:** Showing CPU, memory, and health status directly on the canvas.
- **Domain-Specific Styling:** Using semantic colors for 'Healthy', 'Degraded', and 'Down' statuses to provide immediate visual feedback.

### 3. User Experience & Design
- **Inspector Pattern:** Modeled after professional tools like Figma or AWS Console, where selecting an object opens a detailed configuration panel.
- **Responsive Layout:** The app is fully responsive. On mobile, the inspector and app selector transition into a drawer-style overlay to maximize canvas space.
- **Persistence:** Connections and node updates are saved back to a mock in-memory database, simulating a real-world API lifecycle.

### 4. Performance Optimizations
- **Memoization:** Custom nodes are wrapped in `React.memo` to prevent unnecessary re-renders when the canvas is moved or zoomed.
- **Debounced Persist:** In the `NodeInspector`, updates to node properties (like names) are debounced before hitting the mock API to prevent excessive network overhead.
