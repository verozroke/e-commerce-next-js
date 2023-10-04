import { ProductFormValidator } from '@/app/(dashboard)/[storeId]/(routes)/products/[productId]/components/product-form'
import axios from 'axios'

class ProductService {
  private baseUrl = 'https://e-commerce-next-js-admin-six.vercel.app/api'

  constructor() {
  }

  async createProduct(storeId: string, body: ProductFormValidator) {
    console.log(body)
    return axios.post(`${this.baseUrl}/${storeId}/products`, body)
  }

  async updateProduct(storeId: string, productId: string, body: ProductFormValidator) {
    return axios.patch(`/api/${storeId}/products/${productId}`, body)
  }

  async deleteProduct(storeId: string, productId: string) {
    return axios.delete(`/api/${storeId}/products/${productId}`)
  }
}

const productService = new ProductService()

export default productService