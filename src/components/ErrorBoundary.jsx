import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { erro: false };
  static getDerivedStateFromError() { return { erro: true }; }
  render() { return this.state.erro ? this.props.fallback : this.props.children; }
}