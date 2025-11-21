export default function FrostedGlass({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`backdrop-blur-2xl bg-white/10 dark:bg-gray-900/10 m-6 border border-white/20 rounded-2xl ${className}`}>
      {children}
    </div>
  )
}
