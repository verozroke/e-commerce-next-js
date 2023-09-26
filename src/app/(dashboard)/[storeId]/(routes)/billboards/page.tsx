import { FC } from 'react'
import BillboardClient from './compontents/client'

interface pageProps {

}

const page: FC<pageProps> = ({ }) => {
  return <div className="flex flex-col">
    <div className="flex-1 space-y-4 p-8 pt-6">
      <BillboardClient />
    </div>
  </div>
}
export default page