import db from '@/lib/prisma.db'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { FC } from 'react'
import SettingsForm from './components/settings-form'

interface pageProps {
  params: {
    storeId: string
  }
}

const page: FC<pageProps> = async ({ params }) => {

  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const store = await db.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    }
  })

  if (!store) {
    redirect('/')
  }



  return <div className='flex flex-col'>
    <div className="flex-1 space-y-4 p-8 pt-6">
      <SettingsForm initialData={store} />
    </div>
  </div>
}

export default page