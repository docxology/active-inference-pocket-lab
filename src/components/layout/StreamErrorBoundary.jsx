/**
 * @file StreamErrorBoundary.jsx — Catches lazy-stream chunk failures
 * @description If a module bundle fails to load or throws during render, the learner
 * gets a retry instead of a blank shell.
 *
 * @module components/layout/StreamErrorBoundary
 */
import { Component } from 'react';
import './StreamErrorBoundary.css';

export default class StreamErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="stream-error-boundary" role="alert">
          <p className="stream-error-boundary__title">This stream could not load.</p>
          <p className="stream-error-boundary__detail">
            {String(this.state.error?.message || this.state.error)}
          </p>
          <button
            type="button"
            className="stream-error-boundary__retry"
            onClick={() => this.setState({ error: null })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
