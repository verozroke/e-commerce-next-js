import { FC } from 'react'
import ColorClient from './compontents/client'
import db from '@/lib/prisma.db'
import { ColorColumn } from './compontents/columns'
import { format } from 'date-fns'

interface pageProps {
  params: {
    storeId: string
  }
}

const page: FC<pageProps> = async ({ params }) => {

  const colors = await db.color.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedColors: ColorColumn[] = colors.map(color => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: format(color.createdAt, 'MMMM dd, yyyy'),
  }))

  return <div className="flex flex-col">
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ColorClient data={formattedColors} />
    </div>
  </div>
}
export default page