import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ReactFlowProvider } from 'reactflow';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'reactflow/dist/style.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        <App />
      </ReactFlowProvider>
    </QueryClientProvider>
  </React.StrictMode>
);