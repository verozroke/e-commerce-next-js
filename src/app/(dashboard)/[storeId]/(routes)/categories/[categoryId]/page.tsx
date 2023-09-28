import db from '@/lib/prisma.db'
import { FC } from 'react'
import CategoryForm from './components/category-form'

interface pageProps {
  params: {
    categoryId: string
    storeId: string
  }
}

const page: FC<pageProps> = async ({ params }) => {

  const { categoryId } = params

  const category = await db.category.findUnique({
    where: {
      id: categoryId
    }
  })


  const billboards = await db.billboard.findMany({
    where: {
      storeId: params.storeId
    }
  })

  return (
    <div className="flex-col flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </div>
  )
}

export default page