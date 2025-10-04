import Link from 'next/link'
import { Plus, Edit, Eye } from 'lucide-react'
import { CustomersClient } from './CustomersClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default function CustomersPage() {
  return <CustomersClient />
}


