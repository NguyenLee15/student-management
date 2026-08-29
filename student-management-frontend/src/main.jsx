import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Lỗi React không mong muốn:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: '40px', fontFamily: 'sans-serif' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', background: '#0f172a', padding: '30px', borderRadius: '16px', border: '1px solid #ef4444' }}>
            <h1 style={{ color: '#ef4444', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
              ⚠️ Đã xảy ra lỗi giao diện
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
              {this.state.error && this.state.error.toString()}
            </p>
            <button 
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              style={{ background: '#4f46e5', color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
            >
              🔄 Xóa cache & Tải lại trang
            </button>
            {this.state.errorInfo && (
              <pre style={{ marginTop: '20px', background: '#020617', padding: '15px', borderRadius: '8px', fontSize: '12px', overflowX: 'auto', color: '#fca5a5' }}>
                {this.state.errorInfo.componentStack}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

