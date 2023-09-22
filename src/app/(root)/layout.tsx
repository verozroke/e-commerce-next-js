import db from '@/lib/prisma.db'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { FC } from 'react'

interface layoutProps {
  children: React.ReactNode
}

const layout: FC<layoutProps> = async ({ children }) => {

  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const store = await db.store.findFirst({
    where: {
      userId
    }
  })

  if (store) {
    redirect(`/${store.id}`)
  }


  return <>{children}</>
}

export default layout