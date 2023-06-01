import type { ReactElement } from 'react'

namespace iRow {
  export interface props {
    children: ReactElement | ReactElement[]
  }
}

export default function Row({ children }: iRow.props) {
  return (
    <div
      id="markers-list"
      className="flex flex-row"
    >
      {children}
    </div>
  )
}
