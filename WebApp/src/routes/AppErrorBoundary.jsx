// src/routes/AppErrorBoundary.jsx
import { Component } from "react";

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log opcional
    console.error("AppErrorBoundary:", error, info);
    if (window.__TOAST__) {
      window.__TOAST__.error(error?.message || "Ha ocurrido un error inesperado");
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Ocurrió un problema</h2>
          <p>Tranquilo, ya lo estamos registrando. Puedes continuar navegando.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
