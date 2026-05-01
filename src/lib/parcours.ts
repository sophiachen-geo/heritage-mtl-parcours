// Palette stable utilisée pour distinguer les parcours sur la carte partagée.
// L'index dans le tableau correspond au numéro de circuit moins un.
// Chaque couleur est suffisamment foncée pour rester lisible sur les tuiles
// CartoDB Positron tintées sépia, et choisie pour préserver une cohérence
// avec les jetons de design (--accent, --azure, --jade, --gold) du site.
export const PARCOURS_COLORS = [
  '#7c2d12', // 1 — brique (--accent)
  '#1f3a5f', // 2 — azur profond (--azure)
  '#2f5d3f', // 3 — jade (--jade)
  '#a4671b', // 4 — or (--gold)
  '#5d2f5e', // 5 — aubergine
  '#1e6a7a', // 6 — océan
  '#6b3410', // 7 — terre cuite
  '#3a4d2a', // 8 — olivier
] as const;

export function colorForCircuit(circuit: string | number): string {
  const n = typeof circuit === 'string' ? parseInt(circuit, 10) : circuit;
  if (!Number.isFinite(n)) return PARCOURS_COLORS[0];
  const idx = ((n - 1) % PARCOURS_COLORS.length + PARCOURS_COLORS.length) % PARCOURS_COLORS.length;
  return PARCOURS_COLORS[idx];
}
