"use client"


import Heading from '@/components/heading'
import { Plus } from 'lucide-react'
import { FC } from 'react'
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { CategoryColumn, columns } from './columns';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface CategoryClientProps {
  data: CategoryColumn[]
}

const CategoryClient: FC<CategoryClientProps> = ({ data }) => {

  const router = useRouter()
  const params = useParams()

  return <>
    <div className='flex items-center justify-between'>
      <Heading title={`Categories (${data.length})`} description='Manage categories for your store' />
      <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
        <Plus className='mr-2 h-4 w-4' />
        Add New
      </Button>
    </div>
    <Separator />
    <DataTable searchKey='name' columns={columns} data={data} />
    <Separator />
    <ApiList entityName="categories" entityIdName="categoryId" />
  </>
}

export default CategoryClient