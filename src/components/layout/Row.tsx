import type { ReactElement } from 'react'

namespace iRow {
  export interface props {
    children: ReactElement | ReactElement[]
    className?: string
  }
}

export default function Row({ className, children }: iRow.props) {
  return <div className={`${className ?? ''} flex flex-row`}>{children}</div>
}
