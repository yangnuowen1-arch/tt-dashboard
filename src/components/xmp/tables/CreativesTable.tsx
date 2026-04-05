const rows = [
  {
    name: "20240417G.mp4",
    rating: 4,
    tags: "爆款",
    designer: "Lily",
    source: "本地上传",
    type: "视频",
    groups: 3,
    spend: "120.00",
    impressions: "210,000",
    cpm: "0.57",
    clicks: "2,450",
    cpc: "0.049",
    ctr: "1.17%",
    conv: "56",
  },
];

export function CreativesTable() {
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="min-w-[1180px] w-full border-collapse text-left text-sm text-gray-700 dark:text-gray-200">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
            <th className="w-10 px-3 py-2.5">
              <input type="checkbox" className="rounded border-gray-300" aria-label="全选" />
            </th>
            <th className="min-w-[72px] px-3 py-2.5">缩略图</th>
            <th className="min-w-[180px] px-3 py-2.5">素材名称</th>
            <th className="min-w-[100px] px-3 py-2.5">评分</th>
            <th className="min-w-[100px] px-3 py-2.5">标签</th>
            <th className="min-w-[100px] px-3 py-2.5">设计师</th>
            <th className="min-w-[100px] px-3 py-2.5">来源</th>
            <th className="min-w-[80px] px-3 py-2.5">类型</th>
            <th className="min-w-[120px] px-3 py-2.5">关联广告组数</th>
            <th className="min-w-[90px] px-3 py-2.5">花费</th>
            <th className="min-w-[90px] px-3 py-2.5">展示数</th>
            <th className="min-w-[80px] px-3 py-2.5">CPM</th>
            <th className="min-w-[80px] px-3 py-2.5">点击数</th>
            <th className="min-w-[80px] px-3 py-2.5">CPC</th>
            <th className="min-w-[80px] px-3 py-2.5">CTR</th>
            <th className="min-w-[100px] px-3 py-2.5">实时转化</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.name}
              className="border-b border-gray-100 hover:bg-gray-50/80 dark:border-gray-800 dark:hover:bg-white/[0.04]"
            >
              <td className="px-3 py-2.5 align-top">
                <input type="checkbox" className="mt-1 rounded border-gray-300" aria-label={`选择 ${r.name}`} />
              </td>
              <td className="px-3 py-2.5">
                <div className="h-14 w-14 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800" />
              </td>
              <td className="px-3 py-2.5">
                <button type="button" className="font-medium text-[#1677ff] hover:underline">
                  {r.name}
                </button>
              </td>
              <td className="px-3 py-2.5">
                <span className="text-amber-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
              </td>
              <td className="px-3 py-2.5">
                <button type="button" className="text-[#1677ff] hover:underline">
                  {r.tags}
                </button>
              </td>
              <td className="px-3 py-2.5">
                <button type="button" className="text-[#1677ff] hover:underline">
                  {r.designer}
                </button>
              </td>
              <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400">{r.source}</td>
              <td className="px-3 py-2.5">{r.type}</td>
              <td className="px-3 py-2.5">{r.groups}</td>
              <td className="px-3 py-2.5">${r.spend}</td>
              <td className="px-3 py-2.5">{r.impressions}</td>
              <td className="px-3 py-2.5">${r.cpm}</td>
              <td className="px-3 py-2.5">{r.clicks}</td>
              <td className="px-3 py-2.5">${r.cpc}</td>
              <td className="px-3 py-2.5">{r.ctr}</td>
              <td className="px-3 py-2.5">{r.conv}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
