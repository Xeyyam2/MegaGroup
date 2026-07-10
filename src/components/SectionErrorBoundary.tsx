"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

// Bölmə səviyyəli xəta sərhədi: bir bölmə xəta verərsə bütün səhifə deyil,
// yalnız o bölmə əziyyət çəkir.
export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    console.error("[SectionErrorBoundary]", error.message);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="glass rounded-2xl p-8 text-center text-foreground/60">
            Bu bölmə müvəqqəti olaraq əlçatan deyil.
          </div>
        )
      );
    }
    return this.props.children;
  }
}
