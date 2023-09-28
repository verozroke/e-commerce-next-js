import { FC } from 'react'
import BillboardClient from './compontents/client'
import db from '@/lib/prisma.db'
import { BillboardColumn } from './compontents/columns'
import { format } from 'date-fns'

interface pageProps {
  params: {
    storeId: string
  }
}

const page: FC<pageProps> = async ({ params }) => {

  const billboards = await db.billboard.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedBillboards: BillboardColumn[] = billboards.map(billboard => ({
    id: billboard.id,
    label: billboard.label,
    createdAt: format(billboard.createdAt, 'MMMM dd, yyyy'),
  }))

  return <div className="flex flex-col">
    <div className="flex-1 space-y-4 p-8 pt-6">
      <BillboardClient data={formattedBillboards} />
    </div>
  </div>
}
export default page