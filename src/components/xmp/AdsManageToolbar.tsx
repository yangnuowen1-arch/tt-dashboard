"use client";

type AdsManageToolbarProps = {
  title?: string;
  showCreate?: boolean;
};

export function AdsManageToolbar({
  title = "数据列表",
  showCreate = true,
}: AdsManageToolbarProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect label="广告账户" />
        <FilterSelect label="产品" />
        <FilterSelect label="优化师" />
        <button
          type="button"
          className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
        >
          批量操作
        </button>
        <button
          type="button"
          className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
        >
          分组分析
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-500">{title}</span>
        <div className="flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700 shadow-sm">
          <span>2024-04-05</span>
          <span className="text-gray-400">~</span>
          <span>2024-04-05</span>
        </div>
        <ToolbarIconButton label="刷新" />
        <ToolbarTextButton>同步数据</ToolbarTextButton>
        <ToolbarTextButton>导出</ToolbarTextButton>
        <ToolbarTextButton>自定义列</ToolbarTextButton>
        {showCreate && (
          <button
            type="button"
            className="rounded-md bg-[#1677ff] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#4096ff]"
          >
            创建广告
          </button>
        )}
      </div>
    </div>
  );
}

function FilterSelect({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
    >
      {label}
      <ChevronDown className="text-gray-400" />
    </button>
  );
}

function ToolbarTextButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="rounded-md px-2 py-1.5 text-sm text-gray-600 hover:bg-white hover:text-gray-900"
    >
      {children}
    </button>
  );
}

function ToolbarIconButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50"
    >
      <RefreshIcon />
    </button>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12a8 8 0 0113.657-5.657M20 12a8 8 0 01-13.657 5.657M4 12H1m19 0h3M12 4V1m0 19v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
