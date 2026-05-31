import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type Variant = "solid" | "link" | "outline";

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "group/btn inline-flex items-center justify-center gap-2 font-body font-medium leading-none tracking-wide transition-all duration-200 ease-out select-none";

const variants: Record<Variant, string> = {
  // Botón primario — Verde Glaciar, sube ligeramente y profundiza al hover.
  solid:
    "bg-glaciar text-on-glaciar rounded-full px-6 py-3 text-sm shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_8px_20px_-12px_rgba(42,127,138,0.7)] hover:bg-austral hover:text-on-austral hover:shadow-[0_10px_28px_-14px_rgba(26,43,60,0.8)] hover:-translate-y-0.5 active:translate-y-0",
  // Link de acción — texto glaciar/celeste con flecha que avanza al hover.
  link: "text-glaciar text-sm font-semibold hover:text-celeste",
  // Outline — borde austral discreto que se rellena al hover.
  outline:
    "border border-austral/25 text-austral rounded-full px-6 py-3 text-sm hover:border-austral hover:bg-austral hover:text-on-austral hover:-translate-y-0.5 active:translate-y-0",
};

function content(variant: Variant, children: ReactNode) {
  if (variant === "link") {
    return (
      <>
        {children}
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-200 ease-out group-hover/btn:translate-x-1"
        >
          →
        </span>
      </>
    );
  }
  return children;
}

export function Button(props: ButtonProps) {
  const { variant = "solid", children, className = "", ...rest } = props;
  const classes = `${base} ${variants[variant]} ${className}`.trim();

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } =
      rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    const isInternal = href.startsWith("/");
    if (isInternal) {
      return (
        <Link href={href} className={classes} {...anchorRest}>
          {content(variant, children)}
        </Link>
      );
    }
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        {...anchorRest}
      >
        {content(variant, children)}
      </a>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} {...buttonRest}>
      {content(variant, children)}
    </button>
  );
}

export default Button;
