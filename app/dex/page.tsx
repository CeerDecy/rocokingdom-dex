export default function DexPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent text-[#101828]">
      <div className="mx-auto w-full max-w-6xl px-6 pb-16 pt-24">
        <div className="flex flex-col gap-10">
          <div className="max-w-2xl">
            <span className="w-fit rounded-full border border-black/10 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-black/70">
              Dex
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-black sm:text-5xl">
              精灵图鉴
            </h1>
            <p className="mt-3 text-base text-black/70">
              按生态区域、属性与稀有度检索精灵档案，快速查看进化与技能
              线索。
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[26px] border border-black/10 bg-white/85 p-6 shadow-[0_22px_50px_-36px_rgba(16,24,40,0.45)]">
              <div className="flex items-center gap-3 text-sm font-semibold text-black">
                <div className="h-2.5 w-2.5 rounded-full bg-black" />
                分类浏览
              </div>
              <p className="mt-3 text-sm text-black/70">
                选择属性、生态区域或稀有度，建立自己的精灵分类视角。
              </p>
              <div className="mt-5 rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm text-black/70">
                即将上线：筛选器与标签组合
              </div>
            </div>
            <div className="rounded-[26px] border border-black/10 bg-white/85 p-6 shadow-[0_22px_50px_-36px_rgba(16,24,40,0.45)]">
              <div className="flex items-center gap-3 text-sm font-semibold text-black">
                <div className="h-2.5 w-2.5 rounded-full bg-black" />
                精灵档案
              </div>
              <p className="mt-3 text-sm text-black/70">
                记录技能、进化路线与生态备注，形成完整的观察笔记。
              </p>
              <div className="mt-5 rounded-2xl border border-black/10 bg-gradient-to-br from-black/5 via-white to-white px-4 py-3 text-sm text-black/70">
                即将上线：收藏与对比面板
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
