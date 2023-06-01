import type { ReactElement } from 'react'

namespace iColumn {
  export interface props {
    children: ReactElement | ReactElement[]
  }
}

export default function Column({ children }: iColumn.props) {
  return <div className="flex flex-col">{children}</div>
}
