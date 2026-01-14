const spotlightCreatures = [
  {
    id: "079",
    name: "光棱狐",
    type: ["光", "风"],
    habitat: "晨雾林地",
    affinity: 81,
  },
  {
    id: "112",
    name: "熔核狮",
    type: ["火", "岩"],
    habitat: "赤曜火山",
    affinity: 88,
  },
  {
    id: "138",
    name: "海眠鲸",
    type: ["水", "秘"],
    habitat: "深潮湾",
    affinity: 83,
  },
];

const activityFeed = [
  {
    time: "12分钟前",
    title: "霜簇灵鹿进入极昼边界",
    detail: "族群活跃度 79%，可解锁冰系新姿态。",
  },
  {
    time: "35分钟前",
    title: "风暴天幕监测完成",
    detail: "风系精灵密度上升，推荐远程队伍。",
  },
  {
    time: "1小时前",
    title: "雷镜雀完成共鸣记录",
    detail: "亲和指数 +6，技能栏解锁加速。",
  },
];

const bentoCards = [
  {
    title: "生态雷达",
    desc: "天气、昼夜、族群轨迹实时叠加。",
    stat: "24 区域",
  },
  {
    title: "进化罗盘",
    desc: "多分支进化路线与需求素材一览。",
    stat: "118 路线",
  },
  {
    title: "战斗策略",
    desc: "属性克制与阵容搭配建议。",
    stat: "86 方案",
  },
  {
    title: "训练者档案",
    desc: "小队配置、战斗记录与成就徽记。",
    stat: "312 记录",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent text-[#101828]">
      <main className="relative pt-24">
        <section className="mx-auto flex max-w-7xl flex-col gap-12 px-6 pb-16 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-xl flex-col gap-6">
            <span className="w-fit rounded-full border border-black/10 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-black/70">
              Rocokindom Dex
            </span>
            <h1 className="font-display text-6xl tracking-[0.08em] text-black">
              洛可王国
              <span className="text-[#1f2937]">精灵图鉴</span>
            </h1>
            <p className="text-base leading-7 text-black/70">
              从生态追踪到战斗策略，建立属于训练者的精灵档案库。扫码即可解锁
              习性、技能与进化路径。
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black/80">
                开始扫描
              </button>
              <button className="rounded-full border border-black/20 bg-white/80 px-6 py-3 text-sm font-semibold text-black transition-colors hover:border-black/40">
                训练者档案
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-2">
              {[
                { label: "收录精灵", value: "312" },
                { label: "生态区域", value: "24" },
                { label: "进化路线", value: "118" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">
                    {item.label}
                  </div>
                  <div className="font-display text-3xl text-black">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full max-w-lg">
            <div className="rounded-[28px] border border-black/10 bg-white/85 p-6 shadow-[0_26px_60px_-40px_rgba(16,24,40,0.45)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-black/50">
                    Live Scan
                  </div>
                  <div className="font-display text-4xl text-black">
                    S-079
                  </div>
                </div>
                <div className="rounded-full border border-black/10 bg-black px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                  稀有度 S
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-black/10 bg-gradient-to-br from-black/5 via-white to-white p-4">
                <div className="flex items-center justify-between text-sm font-semibold text-black/70">
                  <span>光棱狐</span>
                  <span>Lv. 42</span>
                </div>
                <div className="mt-3 rounded-xl border border-black/10 bg-white/80 p-4">
                  <div className="flex items-center justify-between text-xs text-black/60">
                    <span>机动 / 速度</span>
                    <span>光 · 风</span>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-black/5">
                    <div className="h-2 w-4/5 rounded-full bg-black/70" />
                  </div>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-black/40">
                    Mobility 81%
                  </div>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "栖息地", value: "晨雾林地" },
                  { label: "性格", value: "谨慎" },
                  { label: "亲和指数", value: "81/100" },
                  { label: "技能", value: "光束跃迁" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-black/10 bg-white/80 px-4 py-3"
                  >
                    <div className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                      {item.label}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-black">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-5 w-full rounded-full border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-black/60 transition-colors hover:border-black/30">
                打开扫描面板
              </button>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="mx-auto flex max-w-7xl flex-col gap-6 px-6 pb-10"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-display text-4xl tracking-wide text-black">
                训练者工具集
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-black/70">
                图鉴、生态与策略统一管理，任务提醒与收藏夹同步全设备。
              </p>
            </div>
            <button className="w-fit rounded-full border border-black/20 bg-white/80 px-5 py-2 text-xs font-semibold text-black transition-colors hover:border-black/40">
              打开控制台
            </button>
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {bentoCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[22px] border border-black/10 bg-white/80 p-5 shadow-[0_18px_40px_-32px_rgba(16,24,40,0.45)]"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-black/40">
                  模块
                </div>
                <div className="mt-3 text-lg font-semibold text-black">
                  {card.title}
                </div>
                <p className="mt-2 text-sm leading-6 text-black/60">
                  {card.desc}
                </p>
                <div className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-black/60">
                  {card.stat}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="zones"
          className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-display text-4xl tracking-wide text-black">
                生态雷达 · 即时动态
              </h2>
              <p className="mt-2 text-sm text-black/70">
                每个区域同步显示气候变化与族群迁徙路线，避免错过稀有精灵。
              </p>
            </div>
            <div className="rounded-full border border-black/15 bg-white/80 px-5 py-2 text-xs font-semibold text-black/70">
              今日更新 6 条
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-[26px] border border-black/10 bg-white/85 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-black/40">
                    Region
                  </div>
                  <div className="text-xl font-semibold text-black">
                    风暴天幕
                  </div>
                </div>
                <div className="rounded-full border border-black/10 bg-black px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                  风系高发
                </div>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "气候", value: "裂风增幅" },
                  { label: "目击", value: "12 族群" },
                  { label: "稀有", value: "2 只" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
                  >
                    <div className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                      {item.label}
                    </div>
                    <div className="mt-1 font-semibold text-black">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-24 rounded-2xl border border-dashed border-black/20 bg-gradient-to-br from-black/5 to-white" />
              <div className="mt-4 flex items-center justify-between text-xs text-black/60">
                <span>活跃度 78%</span>
                <button className="rounded-full border border-black/15 px-4 py-1 text-xs font-semibold text-black/70 transition-colors hover:border-black/30">
                  进入区域
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {activityFeed.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[22px] border border-black/10 bg-white/80 px-5 py-4"
                >
                  <div className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                    {item.time}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-black">
                    {item.title}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-black/60">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="evolution"
          className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10"
        >
          <div>
            <h2 className="font-display text-4xl tracking-wide text-black">
              精选图鉴档案
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-black/70">
              重点关注近期活跃精灵，快速判断亲和度与培养方向。
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {spotlightCreatures.map((creature) => (
              <div
                key={creature.id}
                className="rounded-[22px] border border-black/10 bg-white/80 p-5 shadow-[0_20px_50px_-35px_rgba(16,24,40,0.45)]"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-[0.2em] text-black/40">
                    Dex #{creature.id}
                  </div>
                  <div className="flex gap-2">
                    {creature.type.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-black/10 bg-white/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 text-lg font-semibold text-black">
                  {creature.name}
                </div>
                <div className="text-xs text-black/60">
                  栖息地 · {creature.habitat}
                </div>
                <div className="mt-4 h-2 w-full rounded-full bg-black/5">
                  <div
                    className="h-2 rounded-full bg-black/70"
                    style={{ width: `${creature.affinity}%` }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-black/50">
                  <span>亲和指数</span>
                  <span className="font-semibold text-black/80">
                    {creature.affinity} / 100
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="download"
          className="mx-auto flex max-w-7xl flex-col gap-6 px-6 pb-16 pt-10"
        >
          <div className="rounded-[28px] border border-black/10 bg-black px-8 py-10 text-white">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Companion App
                </div>
                <h2 className="font-display text-4xl tracking-wide">
                  让图鉴随身同行
                </h2>
                <p className="mt-2 max-w-xl text-sm text-white/70">
                  离线记录、战斗日志、生态相册与训练者小队配置同步完成。
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/80">
                  iOS 预约
                </button>
                <button className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white">
                  Android 预约
                </button>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                "扫描识别与战斗推荐",
                "离线查看生态与技能",
                "训练者档案实时同步",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-xs text-white/80"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
