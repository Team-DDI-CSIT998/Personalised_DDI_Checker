// src/components/LoadingOverlay.tsx
import React from 'react';
import './LoadingOverlay.css';

export interface LoadingOverlayProps {
  visible: boolean;
}

export function LoadingOverlay({ visible }: LoadingOverlayProps) {
  if (!visible) return null;
  return (
    <div className="loading-overlay">
      <div className="spinner" />
    </div>
  );
}

