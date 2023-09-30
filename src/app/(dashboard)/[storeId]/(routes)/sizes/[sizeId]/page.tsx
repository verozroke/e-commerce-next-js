import db from '@/lib/prisma.db'
import { FC } from 'react'
import SizeForm from './components/size-form'

interface pageProps {
  params: {
    sizeId: string
  }
}

const page: FC<pageProps> = async ({ params }) => {

  const { sizeId } = params

  const size = await db.size.findUnique({
    where: {
      id: sizeId
    }
  })

  return (
    <div className="flex-col flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  )
}

export default page