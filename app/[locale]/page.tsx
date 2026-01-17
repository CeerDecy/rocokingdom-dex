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
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-16 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-black/10 bg-white/85 p-6 shadow-[0_26px_60px_-40px_rgba(16,24,40,0.45)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-black/50">
                    Focus Creature
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-black">
                    精灵聚焦
                  </div>
                </div>
                <button className="rounded-full border border-black/10 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black/60">
                  立即更新
                </button>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {spotlightCreatures.map((creature) => (
                  <div
                    key={creature.id}
                    className="rounded-2xl border border-black/10 bg-white/80 p-4"
                  >
                    <div className="text-xs uppercase tracking-[0.3em] text-black/40">
                      Dex #{creature.id}
                    </div>
                    <div className="mt-2 text-lg font-semibold text-black">
                      {creature.name}
                    </div>
                    <div className="mt-2 text-xs text-black/60">
                      {creature.type.join(" · ")}
                    </div>
                    <div className="mt-4 text-sm text-black/70">
                      {creature.habitat}
                    </div>
                    <div className="mt-4 rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/60">
                      Affinity {creature.affinity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {bentoCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-[24px] border border-black/10 bg-white/85 p-5 shadow-[0_18px_40px_-30px_rgba(16,24,40,0.4)]"
                >
                  <div className="text-xs uppercase tracking-[0.3em] text-black/50">
                    {card.title}
                  </div>
                  <div className="mt-2 text-sm text-black/70">
                    {card.desc}
                  </div>
                  <div className="mt-4 text-lg font-semibold text-black">
                    {card.stat}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-black/10 bg-white/85 p-6 shadow-[0_26px_60px_-40px_rgba(16,24,40,0.45)]">
            <div className="text-xs uppercase tracking-[0.3em] text-black/50">
              Activity Feed
            </div>
            <div className="mt-4 space-y-4">
              {activityFeed.map((activity) => (
                <div
                  key={activity.time}
                  className="rounded-2xl border border-black/10 bg-white/80 p-4"
                >
                  <div className="text-xs uppercase tracking-[0.3em] text-black/40">
                    {activity.time}
                  </div>
                  <div className="mt-2 text-base font-semibold text-black">
                    {activity.title}
                  </div>
                  <div className="mt-1 text-sm text-black/65">
                    {activity.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
