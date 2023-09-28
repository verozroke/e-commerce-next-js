import { FC } from 'react'
import CategoryClient from './compontents/client'
import db from '@/lib/prisma.db'
import { CategoryColumn } from './compontents/columns'
import { format } from 'date-fns'

interface pageProps {
  params: {
    storeId: string
  }
}

const page: FC<pageProps> = async ({ params }) => {

  const categories = await db.category.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      billboard: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedCategories: CategoryColumn[] = categories.map(category => ({
    id: category.id,
    name: category.name,
    billboardLabel: category.billboard.label,
    createdAt: format(category.createdAt, 'MMMM dd, yyyy'),
  }))

  return <div className="flex flex-col">
    <div className="flex-1 space-y-4 p-8 pt-6">
      <CategoryClient data={formattedCategories} />
    </div>
  </div>
}
export default page