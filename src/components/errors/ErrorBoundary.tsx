"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-space-lg border border-error/20 bg-error-container text-on-error-container rounded-xl flex flex-col gap-2 max-w-md mx-auto my-10">
          <h2 className="font-bold text-lg">Something went wrong.</h2>
          <p className="text-sm">Please refresh the page or contact support.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
