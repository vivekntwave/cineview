import { Component, type ErrorInfo, type ReactNode } from "react";
import i18n from "../../core/i18n";

interface Props {
  fallback?: ReactNode;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class SectionErrorBoundary extends Component<Props, State> {
  public override state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Section error boundary:", error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-55 w-full flex-col items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100/80 px-6 py-8 text-center backdrop-blur-md dark:border-zinc-900 dark:bg-zinc-950/40">
            <svg className="mb-2 h-8 w-8 text-zinc-400 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              {i18n.t("errorBoundaryTitle", { ns: "common" })}
            </p>
            <p className="mt-1 max-w-xs text-xs text-zinc-500">
              {i18n.t("errorBoundaryBody", { ns: "common" })}
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
