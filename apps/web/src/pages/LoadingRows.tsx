interface Props {
  title: string
}

export const LoadingRows = ({ title }: Props) => {
  return (
    <div className="absolute inset-0 bg-background/40 backdrop-blur-sm z-20 rounded-xl flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-1.5">
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
        <span className="text-sm font-medium text-foreground">{title}</span>
      </div>
    </div>
  )
}