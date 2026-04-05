const rows = [
  {
    name: "TT_US_App_01",
    id: "7234567890123456789",
    optimizer: "Alex",
    updated: "2024-04-05 14:20",
    balance: "12,580.32",
    spend: "1,204.55",
    impressions: "892,341",
    cpm: "1.35",
    cpc: "0.42",
    ctr: "1.12%",
    conversions: "312",
    cpa: "3.86",
    cvr: "3.21%",
  },
  {
    name: "TT_EU_Brand",
    id: "7234567890123456790",
    optimizer: "Jamie",
    updated: "2024-04-05 13:05",
    balance: "6,210.00",
    spend: "820.10",
    impressions: "410,220",
    cpm: "2.00",
    cpc: "0.51",
    ctr: "0.98%",
    conversions: "140",
    cpa: "5.86",
    cvr: "2.45%",
  },
];

export function AccountsTable() {
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="min-w-[1100px] w-full border-collapse text-left text-sm text-gray-700 dark:text-gray-200">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
            <th className="sticky left-0 z-10 w-10 bg-gray-50 px-3 py-2.5 dark:bg-gray-800/50">
              <input type="checkbox" className="rounded border-gray-300" aria-label="全选" />
            </th>
            <th className="min-w-[200px] px-3 py-2.5">广告账户名称</th>
            <th className="min-w-[160px] px-3 py-2.5">广告账户ID</th>
            <th className="min-w-[120px] px-3 py-2.5">操作</th>
            <th className="min-w-[100px] px-3 py-2.5">授权状态</th>
            <th className="min-w-[100px] px-3 py-2.5">优化师</th>
            <th className="min-w-[150px] px-3 py-2.5">上次数据更新时间</th>
            <th className="min-w-[100px] px-3 py-2.5">账户余额</th>
            <th className="min-w-[90px] px-3 py-2.5">花费</th>
            <th className="min-w-[90px] px-3 py-2.5">展示数</th>
            <th className="min-w-[90px] px-3 py-2.5">CPM</th>
            <th className="min-w-[90px] px-3 py-2.5">CPC</th>
            <th className="min-w-[80px] px-3 py-2.5">CTR</th>
            <th className="min-w-[80px] px-3 py-2.5">转化数</th>
            <th className="min-w-[80px] px-3 py-2.5">CPA</th>
            <th className="min-w-[80px] px-3 py-2.5">CVR</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-100 bg-[#fafafa] text-xs font-medium text-gray-600 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300">
            <td className="sticky left-0 bg-[#fafafa] px-3 py-2 dark:bg-gray-900" />
            <td className="px-3 py-2" colSpan={7}>
              汇总
            </td>
            <td className="px-3 py-2">$18,790</td>
            <td className="px-3 py-2">$2,024</td>
            <td className="px-3 py-2">1,302,561</td>
            <td className="px-3 py-2">—</td>
            <td className="px-3 py-2">—</td>
            <td className="px-3 py-2">—</td>
            <td className="px-3 py-2">452</td>
            <td className="px-3 py-2">—</td>
            <td className="px-3 py-2">—</td>
          </tr>
          {rows.map((r) => (
            <tr
              key={r.id}
              className="border-b border-gray-100 hover:bg-gray-50/80 dark:border-gray-800 dark:hover:bg-white/[0.04]"
            >
              <td className="sticky left-0 bg-white px-3 py-2.5 dark:bg-gray-900">
                <input type="checkbox" className="rounded border-gray-300" aria-label={`选择 ${r.name}`} />
              </td>
              <td className="px-3 py-2.5">
                <button type="button" className="font-medium text-[#1677ff] hover:underline">
                  {r.name}
                </button>
              </td>
              <td className="px-3 py-2.5 font-mono text-xs text-gray-600 dark:text-gray-400">{r.id}</td>
              <td className="px-3 py-2.5 text-xs">
                <button type="button" className="text-[#1677ff] hover:underline">
                  同步
                </button>
                <span className="mx-1 text-gray-300">|</span>
                <button type="button" className="text-[#1677ff] hover:underline">
                  小时报表
                </button>
              </td>
              <td className="px-3 py-2.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-xs font-medium text-success-700 dark:bg-success-500/15 dark:text-success-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
                  已授权
                </span>
              </td>
              <td className="px-3 py-2.5">{r.optimizer}</td>
              <td className="px-3 py-2.5 text-xs text-gray-600 dark:text-gray-400">{r.updated}</td>
              <td className="px-3 py-2.5">${r.balance}</td>
              <td className="px-3 py-2.5">${r.spend}</td>
              <td className="px-3 py-2.5">{r.impressions}</td>
              <td className="px-3 py-2.5">${r.cpm}</td>
              <td className="px-3 py-2.5">${r.cpc}</td>
              <td className="px-3 py-2.5">{r.ctr}</td>
              <td className="px-3 py-2.5">{r.conversions}</td>
              <td className="px-3 py-2.5">${r.cpa}</td>
              <td className="px-3 py-2.5">{r.cvr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
