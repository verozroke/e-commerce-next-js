import { FC } from 'react'
import ProductClient from './compontents/client'
import db from '@/lib/prisma.db'
import { ProductColumn } from './compontents/columns'
import { format } from 'date-fns'
import { formatter } from '@/lib/utils'

interface pageProps {
  params: {
    storeId: string
  }
}

const page: FC<pageProps> = async ({ params }) => {

  const products = await db.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedProducts: ProductColumn[] = products.map(product => ({
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    price: formatter.format(product.price.toNumber()),
    category: product.category.name,
    size: product.size.name,
    color: product.color.value,
    createdAt: format(product.createdAt, 'MMMM dd, yyyy'),
  }))

  return <div className="flex flex-col">
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ProductClient data={formattedProducts} />
    </div>
  </div>
}
export default page