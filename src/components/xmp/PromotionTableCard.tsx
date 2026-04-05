export function PromotionTableCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="p-4">{children}</div>
    </div>
  );
}
