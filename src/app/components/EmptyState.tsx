import Link from "next/link";
import { EmptyStateProps } from "../utils/Interface";

export default function EmptyState({ title, subtitle, ctaHref, ctaLabel, }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      {subtitle && <p className="mt-2 text-sm">{subtitle}</p>}
      {ctaHref && ctaLabel && (
        <div className="mt-4">
          <Link href={ctaHref} className="rounded-lg bg-secondary-light px-3 py-1.5 text-sm text-white hover:bg-acc-light/20">
            {ctaLabel}
          </Link>
        </div>
      )}
    </div>
  );
}