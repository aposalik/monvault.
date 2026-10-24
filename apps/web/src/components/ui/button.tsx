import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "quiet" | "destructive";
export type ButtonSize = "md" | "lg";

const baseClasses =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-2.5 rounded-xl font-sans font-semibold transition-[transform,background-color,border-color,color] duration-150 ease-out active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-violet-600 text-white border border-violet-600 hover:bg-violet-700 hover:border-violet-700 hover:-translate-y-0.5",
  secondary:
    "bg-surface text-ink-950 border border-ink-950 hover:bg-muted hover:-translate-y-0.5",
  quiet:
    "bg-transparent text-ink-800 border border-transparent hover:bg-muted hover:text-ink-950",
  destructive:
    "bg-danger-100 text-danger-700 border border-danger-700/30 hover:bg-danger-700 hover:text-white hover:border-danger-700",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-[15px] leading-5",
  lg: "px-6 py-3.5 text-base leading-5 min-h-12",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  pending?: boolean;
  pendingLabel?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  pending = false,
  pendingLabel,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || pending;

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-busy={pending || undefined}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}
      {...props}
    >
      {pending ? (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : null}
      <span>{pending && pendingLabel ? pendingLabel : children}</span>
    </button>
  );
}

export interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  external?: boolean;
  children: ReactNode;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  external = false,
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  if (external || href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={classes}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}
