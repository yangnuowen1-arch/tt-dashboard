const rows = [
  {
    name: "Spring Install — US",
    objective: "应用安装",
    status: "投放中",
    budget: "500 / 日",
    spendPct: 62,
    modified: "2024-04-05 11:02",
    spend: "310.20",
    impressions: "220,110",
    cpm: "1.41",
    cpc: "0.39",
    ctr: "1.05%",
    conversions: "88",
    cpa: "3.52",
  },
];

export function CampaignsTable() {
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="min-w-[1200px] w-full border-collapse text-left text-sm text-gray-700 dark:text-gray-200">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
            <th className="w-10 px-3 py-2.5">
              <input type="checkbox" className="rounded border-gray-300" aria-label="全选" />
            </th>
            <th className="min-w-[240px] px-3 py-2.5">推广系列名称</th>
            <th className="min-w-[120px] px-3 py-2.5">操作</th>
            <th className="min-w-[100px] px-3 py-2.5">推广目标</th>
            <th className="min-w-[100px] px-3 py-2.5">状态</th>
            <th className="min-w-[100px] px-3 py-2.5">预算</th>
            <th className="min-w-[140px] px-3 py-2.5">日消耗进度</th>
            <th className="min-w-[140px] px-3 py-2.5">最近修改</th>
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
            <td className="px-3 py-2" colSpan={7}>
              汇总
            </td>
            <td className="px-3 py-2">$310</td>
            <td className="px-3 py-2">220,110</td>
            <td className="px-3 py-2">—</td>
            <td className="px-3 py-2">—</td>
            <td className="px-3 py-2">—</td>
            <td className="px-3 py-2">88</td>
            <td className="px-3 py-2">—</td>
          </tr>
          {rows.map((r) => (
            <tr
              key={r.name}
              className="border-b border-gray-100 hover:bg-gray-50/80 dark:border-gray-800 dark:hover:bg-white/[0.04]"
            >
              <td className="px-3 py-2.5 align-top">
                <input type="checkbox" className="mt-1 rounded border-gray-300" aria-label={`选择 ${r.name}`} />
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-start gap-2">
                  <button
                    type="button"
                    role="switch"
                    aria-checked="true"
                    className="relative mt-0.5 h-5 w-9 shrink-0 rounded-full bg-[#1677ff] transition-colors"
                  >
                    <span className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm" />
                  </button>
                  <div>
                    <button type="button" className="text-left font-medium text-[#1677ff] hover:underline">
                      {r.name}
                    </button>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">TikTok · 自动版位</p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-2.5 align-top text-xs">
                <div className="flex flex-col gap-1">
                  <button type="button" className="text-left text-[#1677ff] hover:underline">
                    详情
                  </button>
                  <button type="button" className="text-left text-[#1677ff] hover:underline">
                    草稿
                  </button>
                  <button type="button" className="text-left text-[#1677ff] hover:underline">
                    小时报表
                  </button>
                </div>
              </td>
              <td className="px-3 py-2.5">{r.objective}</td>
              <td className="px-3 py-2.5">{r.status}</td>
              <td className="px-3 py-2.5">USD {r.budget}</td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full rounded-full bg-[#1677ff]"
                      style={{ width: `${r.spendPct}%` }}
                    />
                  </div>
                  <span className="w-8 text-xs text-gray-500">{r.spendPct}%</span>
                </div>
              </td>
              <td className="px-3 py-2.5 text-xs text-gray-600 dark:text-gray-400">{r.modified}</td>
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
