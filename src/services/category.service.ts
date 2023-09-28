import { CategoryFormValidator } from '@/app/(dashboard)/[storeId]/(routes)/categories/[categoryId]/components/category-form'
import axios from 'axios'

class CategoryService {
  private baseUrl = 'http://localhost:3000/api'

  constructor() {
  }

  async createCategory(storeId: string, body: CategoryFormValidator) {
    return axios.post(`${this.baseUrl}/${storeId}/categories`, body)
  }

  async updateCategory(storeId: string, categoryId: string, body: CategoryFormValidator) {
    return axios.patch(`/api/${storeId}/categories/${categoryId}`, body)
  }

  async deleteCategory(storeId: string, categoryId: string) {
    return axios.delete(`/api/${storeId}/categories/${categoryId}`)
  }
}

const categoryService = new CategoryService()

export default categoryService