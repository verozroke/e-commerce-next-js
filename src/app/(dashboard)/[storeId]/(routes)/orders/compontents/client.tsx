"use client"

import Heading from '@/components/heading'
import { FC } from 'react'
import { OrderColumn, columns } from './columns';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';

interface ProductClientProps {
  data: OrderColumn[]
}

const ProductClient: FC<ProductClientProps> = ({ data }) => {
  return <>
    <Heading title={`Products (${data.length})`} description='Manage products for your store' />
    <Separator />
    <DataTable searchKey='products' columns={columns} data={data} />
  </>
}

export default ProductClient