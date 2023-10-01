import db from '@/lib/prisma.db'
import { FC } from 'react'
import ColorForm from './components/color-form'

interface pageProps {
  params: {
    colorId: string
  }
}

const page: FC<pageProps> = async ({ params }) => {

  const { colorId } = params

  const color = await db.color.findUnique({
    where: {
      id: colorId
    }
  })

  return (
    <div className="flex-col flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  )
}

export default page