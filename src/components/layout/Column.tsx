import type { ReactElement } from 'react'

namespace iColumn {
  export interface props {
    children: ReactElement | ReactElement[]
    className?: string
  }
}

export default function Column({ className, children }: iColumn.props) {
  return <div className={`${className ?? ''} flex flex-col`}>{children}</div>
}
