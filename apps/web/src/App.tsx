import type React from "react";

interface Props {
  children: React.ReactNode
}

export default function App({ children }: Props) {
  return (
    <div>{children}</div>
  )
}
