interface SummaryCardProps {
  title: string;
  value:React.ReactNode;
  icon: React.ReactNode;
}

export default function SummaryCard({
  title,
  value,
  icon,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h2 className="mt-2 text-3xl font-medium">
            {value}
          </h2>
        </div>

        <div>{icon}</div>
      </div>
    </div>
  );
}