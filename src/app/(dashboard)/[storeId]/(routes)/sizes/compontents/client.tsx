"use client"


import Heading from '@/components/heading'
import { Plus } from 'lucide-react'
import { FC } from 'react'
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { SizeColumn, columns } from './columns';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface SizeClientProps {
  data: SizeColumn[]
}

const SizeClient: FC<SizeClientProps> = ({ data }) => {

  const router = useRouter()
  const params = useParams()

  return <>
    <div className='flex items-center justify-between'>
      <Heading title={`Sizes (${data.length})`} description='Manage sizes for your store' />
      <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
        <Plus className='mr-2 h-4 w-4' />
        Add New
      </Button>
    </div>
    <Separator />
    <DataTable searchKey='name' columns={columns} data={data} />
    <Separator />
    <ApiList entityName="sizes" entityIdName="sizeId" />
  </>
}

export default SizeClient