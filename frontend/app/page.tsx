// app/page.tsx
import Link from "next/link";

const KPIs = [
  { title: "Pedidos Hoje", value: "—", sub: "Média diária do mês: —" },
  { title: "Receita do Mês", value: "—", sub: "Média mensal histórica: —" },
  { title: "Leads Ativos", value: "—", sub: "Média mensal: —" },
  { title: "Estoque Crítico", value: "—", sub: "Part numbers críticos: —" },
];

const tiles = [
  { href: "/mm/catalog", title: "Materiais", desc: "Catálogo, fornecedores e compras" },
  { href: "/sd", title: "Vendas", desc: "Pedidos, clientes e faturas" },
  { href: "/wh", title: "Estoque", desc: "Inventário e movimentações" },
  { href: "/crm", title: "CRM", desc: "Leads e oportunidades" },
  { href: "/fi", title: "Financeiro", desc: "Pagar/Receber/Fluxo" },
  { href: "/analytics", title: "Analytics", desc: "Relatórios e dashboards" },
];

export default async function Home() {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {KPIs.map((k) => (
          <div key={k.title} className="rounded-xl border bg-white p-4">
            <div className="text-sm text-slate-500">{k.title}</div>
            <div className="text-2xl font-semibold">{k.value}</div>
            <div className="text-xs text-slate-500 mt-1">{k.sub}</div>
          </div>
        ))}
      </section>

      {/* Tiles */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map(t => (
          <Link key={t.href} href={t.href} className="rounded-xl border bg-white p-5 hover:shadow-md transition">
            <div className="font-semibold">{t.title}</div>
            <div className="text-sm text-slate-600 mt-1">{t.desc}</div>
          </Link>
        ))}
      </section>
    </div>
  );
}
