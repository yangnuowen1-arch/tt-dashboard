const rows = [
  {
    name: "Video_A_9x16",
    id: "1734567890123456789",
    status: "投放中",
    spend: "48.20",
    impressions: "72,400",
    cpm: "0.67",
    cpc: "0.28",
    ctr: "1.20%",
    conversions: "9",
    cpa: "5.36",
  },
];

export function AdsTable() {
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="min-w-[1100px] w-full border-collapse text-left text-sm text-gray-700 dark:text-gray-200">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
            <th className="w-10 px-3 py-2.5">
              <input type="checkbox" className="rounded border-gray-300" aria-label="全选" />
            </th>
            <th className="min-w-[220px] px-3 py-2.5">广告名称</th>
            <th className="min-w-[140px] px-3 py-2.5">广告ID</th>
            <th className="min-w-[120px] px-3 py-2.5">操作</th>
            <th className="min-w-[120px] px-3 py-2.5">状态</th>
            <th className="min-w-[90px] px-3 py-2.5">花费</th>
            <th className="min-w-[90px] px-3 py-2.5">展示数</th>
            <th className="min-w-[80px] px-3 py-2.5">CPM</th>
            <th className="min-w-[80px] px-3 py-2.5">CPC</th>
            <th className="min-w-[80px] px-3 py-2.5">CTR</th>
            <th className="min-w-[80px] px-3 py-2.5">转化数</th>
            <th className="min-w-[80px] px-3 py-2.5">CPA</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-100 bg-[#fafafa] text-xs font-medium text-gray-600 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300">
            <td className="px-3 py-2" />
            <td className="px-3 py-2" colSpan={4}>
              汇总
            </td>
            <td className="px-3 py-2">$48</td>
            <td className="px-3 py-2">72,400</td>
            <td className="px-3 py-2">—</td>
            <td className="px-3 py-2">—</td>
            <td className="px-3 py-2">—</td>
            <td className="px-3 py-2">9</td>
            <td className="px-3 py-2">—</td>
          </tr>
          {rows.map((r) => (
            <tr
              key={r.id}
              className="border-b border-gray-100 hover:bg-gray-50/80 dark:border-gray-800 dark:hover:bg-white/[0.04]"
            >
              <td className="px-3 py-2.5 align-top">
                <input type="checkbox" className="mt-1 rounded border-gray-300" aria-label={`选择 ${r.name}`} />
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800" />
                  <div className="flex items-start gap-2">
                    <button
                      type="button"
                      role="switch"
                      aria-checked="true"
                      className="relative mt-1 h-5 w-9 shrink-0 rounded-full bg-[#1677ff]"
                    >
                      <span className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm" />
                    </button>
                    <button type="button" className="text-left font-medium text-[#1677ff] hover:underline">
                      {r.name}
                    </button>
                  </div>
                </div>
              </td>
              <td className="px-3 py-2.5 font-mono text-xs text-gray-600 dark:text-gray-400">{r.id}</td>
              <td className="px-3 py-2.5 align-top text-xs">
                <div className="flex flex-col gap-1">
                  <button type="button" className="text-left text-[#1677ff] hover:underline">
                    详情
                  </button>
                  <button type="button" className="text-left text-[#1677ff] hover:underline">
                    编辑
                  </button>
                  <button type="button" className="text-left text-[#1677ff] hover:underline">
                    复制
                  </button>
                </div>
              </td>
              <td className="px-3 py-2.5">{r.status}</td>
              <td className="px-3 py-2.5">${r.spend}</td>
              <td className="px-3 py-2.5">{r.impressions}</td>
              <td className="px-3 py-2.5">${r.cpm}</td>
              <td className="px-3 py-2.5">${r.cpc}</td>
              <td className="px-3 py-2.5">{r.ctr}</td>
              <td className="px-3 py-2.5">{r.conversions}</td>
              <td className="px-3 py-2.5">${r.cpa}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
