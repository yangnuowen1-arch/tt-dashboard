"use client";

const tabs = ["类型", "素材", "素材组", "设计师", "标签", "创意人"];

export function CreativesSecondaryTabs() {
  return (
    <div className="flex flex-wrap gap-1 border-b border-gray-200 pb-2 dark:border-gray-800">
      {tabs.map((label, i) => (
        <button
          key={label}
          type="button"
          className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
            i === 1
              ? "bg-[#e6f4ff] font-medium text-[#0958d9] dark:bg-[#1677ff]/20 dark:text-[#69b1ff]"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
