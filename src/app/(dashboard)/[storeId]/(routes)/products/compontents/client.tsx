"use client"


import Heading from '@/components/heading'
import { Plus } from 'lucide-react'
import { FC } from 'react'
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { ProductColumn, columns } from './columns';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface ProductClientProps {
  data: ProductColumn[]
}

const ProductClient: FC<ProductClientProps> = ({ data }) => {

  const router = useRouter()
  const params = useParams()

  return <>
    <div className='flex items-center justify-between'>
      <Heading title={`Products (${data.length})`} description='Manage products for your store' />
      <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
        <Plus className='mr-2 h-4 w-4' />
        Add New
      </Button>
    </div>
    <Separator />
    <DataTable searchKey='name' columns={columns} data={data} />
    <Separator />
    <ApiList entityName="products" entityIdName="productId" />
  </>
}

export default ProductClient