"use client"


import Heading from '@/components/heading'
import { Plus } from 'lucide-react'
import { FC } from 'react'
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { BillboardColumn, columns } from './columns';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface BillboardClientProps {
  data: BillboardColumn[]
}

const BillboardClient: FC<BillboardClientProps> = ({ data }) => {

  const router = useRouter()
  const params = useParams()

  return <>
    <div className='flex items-center justify-between'>
      <Heading title={`Billboards (${data.length})`} description='Manage billboard for your store' />
      <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
        <Plus className='mr-2 h-4 w-4' />
        Add New
      </Button>
    </div>
    <Separator />
    <DataTable searchKey='label' columns={columns} data={data} />
    <Separator />
    <ApiList entityName="billboards" entityIdName="billboardId" />
  </>
}

export default BillboardClient