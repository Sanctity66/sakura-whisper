import React, { Component } from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  constructor(props: Props) {
    super(props);
  }

  static getDerivedStateFromError(_: unknown): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  private reset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return <>{this.props.fallback}</>;
      return (
        <div className="relative z-10 min-h-screen w-full flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl p-6 text-center">
            <h2 className="text-lg font-serif font-bold text-slate-800">界面出现错误</h2>
            <p className="mt-2 text-slate-600 text-sm">请重试或返回后再试</p>
            <button
              onClick={this.reset}
              className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-full font-medium active:scale-95 transition-transform"
            >
              重试
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

