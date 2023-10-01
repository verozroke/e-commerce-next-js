import db from '@/lib/prisma.db'
import { FC } from 'react'
import ProductForm from './components/product-form'

interface pageProps {
  params: {
    productId: string
    storeId: string
  }

}

const page: FC<pageProps> = async ({ params }) => {

  const { productId, storeId } = params

  const product = await db.product.findUnique({
    where: {
      id: productId
    },
    include: {
      image: true
    }
  })


  const categories = await db.category.findMany({
    where: {
      storeId,
    }
  })
  const colors = await db.color.findMany({
    where: {
      storeId,
    }
  })
  const sizes = await db.size.findMany({
    where: {
      storeId,
    }
  })

  return (
    <div className="flex-col flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm initialData={product} categories={categories} colors={colors} sizes={sizes} />
      </div>
    </div>
  )
}

export default page