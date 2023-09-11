import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Mettez à jour l'état pour que le prochain rendu affiche le remplacement d'UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Vous pouvez également enregistrer l'erreur dans un service de reporting d'erreurs
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Vous pouvez rendre n'importe quelle interface utilisateur de remplacement
      return (
        <div>
          <h1>Quelque chose s'est mal passé.</h1>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    // Si il n'y a pas d'erreur, renvoyer les enfants normalement
    return this.props.children;
  }
}

export default ErrorBoundary;
