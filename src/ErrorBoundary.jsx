import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-10 max-w-md text-center">
            <h1 className="text-3xl font-black text-gray-900 mb-4">Algo salió mal</h1>
            <p className="text-gray-500 mb-6 text-sm">{this.state.error?.message}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-6 py-3 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors"
            >
              Intentar nuevamente
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
