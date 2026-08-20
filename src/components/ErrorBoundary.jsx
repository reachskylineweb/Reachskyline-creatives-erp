import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          maxWidth: '800px',
          margin: '50px auto',
          backgroundColor: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <h2 style={{ color: '#e11d48', marginTop: 0, fontSize: '22px', fontWeight: 800 }}>
            Application Rendering Crash
          </h2>
          <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
            A runtime error occurred in the React components rendering pipeline. See the details below:
          </p>
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '16px',
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#0f172a',
            overflowX: 'auto',
            marginBottom: '20px',
            whiteSpace: 'pre-wrap'
          }}>
            <strong>Error:</strong> {this.state.error?.toString()}
            {this.state.errorInfo?.componentStack && (
              <div style={{ marginTop: '12px', color: '#475569', fontSize: '12px' }}>
                <strong>Component Stack:</strong>
                {this.state.errorInfo.componentStack}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={this.handleReset}
              style={{
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Reset & Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
