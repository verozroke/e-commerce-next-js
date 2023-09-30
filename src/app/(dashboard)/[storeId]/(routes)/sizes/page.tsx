import { FC } from 'react'
import SizeClient from './compontents/client'
import db from '@/lib/prisma.db'
import { SizeColumn } from './compontents/columns'
import { format } from 'date-fns'

interface pageProps {
  params: {
    storeId: string
  }
}

const page: FC<pageProps> = async ({ params }) => {

  const sizes = await db.size.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedSizes: SizeColumn[] = sizes.map(size => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(size.createdAt, 'MMMM dd, yyyy'),
  }))

  return <div className="flex flex-col">
    <div className="flex-1 space-y-4 p-8 pt-6">
      <SizeClient data={formattedSizes} />
    </div>
  </div>
}
export default page