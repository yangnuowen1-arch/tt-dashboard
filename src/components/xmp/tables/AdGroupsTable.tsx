const rows = [
  {
    name: "US_Android_18-35",
    status: "投放中",
    product: "Demo App",
    budget: "80 / 日",
    spendPct: 45,
    spend: "36.00",
    impressions: "54,200",
    cpm: "0.66",
    cpc: "0.31",
    ctr: "0.92%",
    conversions: "21",
    cvr: "2.10%",
  },
];

export function AdGroupsTable() {
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="min-w-[1180px] w-full border-collapse text-left text-sm text-gray-700 dark:text-gray-200">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
            <th className="w-10 px-3 py-2.5">
              <input type="checkbox" className="rounded border-gray-300" aria-label="全选" />
            </th>
            <th className="min-w-[220px] px-3 py-2.5">广告组名称</th>
            <th className="min-w-[120px] px-3 py-2.5">操作</th>
            <th className="min-w-[100px] px-3 py-2.5">状态</th>
            <th className="min-w-[120px] px-3 py-2.5">产品</th>
            <th className="min-w-[100px] px-3 py-2.5">预算</th>
            <th className="min-w-[140px] px-3 py-2.5">日预算消耗</th>
            <th className="min-w-[90px] px-3 py-2.5">花费</th>
            <th className="min-w-[90px] px-3 py-2.5">展示数</th>
            <th className="min-w-[80px] px-3 py-2.5">CPM</th>
            <th className="min-w-[80px] px-3 py-2.5">CPC</th>
            <th className="min-w-[80px] px-3 py-2.5">CTR</th>
            <th className="min-w-[80px] px-3 py-2.5">转化数</th>
            <th className="min-w-[80px] px-3 py-2.5">CVR</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-100 bg-[#fafafa] text-xs font-medium text-gray-600 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300">
            <td className="px-3 py-2" />
            <td className="px-3 py-2" colSpan={6}>
              汇总
            </td>
            <td className="px-3 py-2">$36</td>
            <td className="px-3 py-2">54,200</td>
            <td className="px-3 py-2">—</td>
            <td className="px-3 py-2">—</td>
            <td className="px-3 py-2">—</td>
            <td className="px-3 py-2">21</td>
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
                    className="relative mt-0.5 h-5 w-9 shrink-0 rounded-full bg-[#1677ff]"
                  >
                    <span className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm" />
                  </button>
                  <button type="button" className="text-left font-medium text-[#1677ff] hover:underline">
                    {r.name}
                  </button>
                </div>
              </td>
              <td className="px-3 py-2.5 align-top text-xs">
                <div className="flex flex-col gap-1">
                  <button type="button" className="text-left text-[#1677ff] hover:underline">
                    详情
                  </button>
                  <button type="button" className="text-left text-[#1677ff] hover:underline">
                    复制
                  </button>
                  <button type="button" className="text-left text-[#1677ff] hover:underline">
                    添加广告
                  </button>
                </div>
              </td>
              <td className="px-3 py-2.5">{r.status}</td>
              <td className="px-3 py-2.5">{r.product}</td>
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
              <td className="px-3 py-2.5">${r.spend}</td>
              <td className="px-3 py-2.5">{r.impressions}</td>
              <td className="px-3 py-2.5">${r.cpm}</td>
              <td className="px-3 py-2.5">${r.cpc}</td>
              <td className="px-3 py-2.5">{r.ctr}</td>
              <td className="px-3 py-2.5">{r.conversions}</td>
              <td className="px-3 py-2.5">{r.cvr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
