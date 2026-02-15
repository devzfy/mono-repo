export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-2">
          <div
            className="w-3 h-3 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          ></div>
          <div
            className="w-3 h-3 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          ></div>
          <div
            className="w-3 h-3 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>

        <div className="text-center">
          <p className="text-foreground font-medium">Loading</p>
          <p className="text-sm text-muted-foreground mt-1">Please wait a moment...</p>
        </div>
      </div>
    </div>
  );
}
