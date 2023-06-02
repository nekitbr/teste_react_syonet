interface DividerProps {
  vertical?: boolean
}

export default function Divider({ vertical }: DividerProps) {
  if (vertical) return <div className="ml-0.5 mr-0.5 inline-block w-0.5 self-stretch bg-gray-600 opacity-30 dark:opacity-50"></div>

  return <hr className="mt-0.5 mb-0.5 h-0.5 bg-gray-600 opacity-30 dark:opacity-50" />
}
