import db from '@/lib/prisma.db'
import { FC } from 'react'
import BillboardForm from './components/billboard-form'

interface pageProps {
  params: {
    billboardId: string
  }
}

const page: FC<pageProps> = async ({ params }) => {

  const { billboardId } = params

  const billboard = await db.billboard.findUnique({
    where: {
      id: billboardId
    }
  })

  return (
    <div className="flex-col flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  )
}

export default page