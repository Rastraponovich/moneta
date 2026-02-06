export default function DashboardLoading() {
  return (
    <div className="min-h-screen p-4 md:p-8 bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-border border-t-primary mb-4" />
        <p className="text-muted">Загрузка...</p>
      </div>
    </div>
  );
}
