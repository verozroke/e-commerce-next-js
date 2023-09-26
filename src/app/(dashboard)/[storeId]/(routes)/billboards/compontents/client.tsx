"use client"


import Heading from '@/components/heading'
import { Plus } from 'lucide-react'
import { FC } from 'react'
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';

interface BillboardClientProps {

}

const BillboardClient: FC<BillboardClientProps> = ({ }) => {

  const router = useRouter()
  const params = useParams()

  return <div className='flex items-center justify-between'>
    <Heading title='Billboards (0)' description='Manage billboard for your store' />
    <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
      <Plus className='mr-2 h-4 w-4' />
      Add New
    </Button>
  </div>
}

export default BillboardClient