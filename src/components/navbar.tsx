import { UserButton, auth } from '@clerk/nextjs'
import { FC } from 'react'
import { MainNav } from './main-nav'
import StoreSwitcher from './store-switcher'
import { redirect } from 'next/navigation'
import db from '@/lib/prisma.db'

interface navbarProps {

}

const navbar: FC<navbarProps> = async ({ }) => {


  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const stores = await db.store.findMany({
    where: {
      userId,
    }
  })



  return <div className="border-b">
    <div className="flex h-16 items-center px-4">
      <StoreSwitcher items={stores} />
      <MainNav className='mx-6' />
      <div className=' ml-auto flex items-center space-x-4'>
        <UserButton afterSignOutUrl='/' />
      </div>
    </div>
  </div>
}

export default navbar