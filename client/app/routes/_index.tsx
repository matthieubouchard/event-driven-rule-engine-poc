import { type MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/react'

export const meta: MetaFunction = () => {
  return [{ title: 'Rule Engine' }]
}

export function loader() {
  return redirect('/rules')
}

export default function Index() {
  return null
}
