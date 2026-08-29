/**
 * Standard page title block -- mirrors the original Blade
 * <x-page-header title="..." subtitle="..."> component.
 *
 *   <PageHeader title="Patients" subtitle="Everyone registered.">
 *     <span className="ht-pill">128 registered</span>
 *   </PageHeader>
 */
export function PageHeader({ title, subtitle, children }) {
  return (
    <section className="ht-page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </section>
  );
}
