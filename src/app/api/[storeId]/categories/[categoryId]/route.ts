import db from '@/lib/prisma.db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from "next/server";



export async function GET(req: Request, { params }: { params: { storeId: string, categoryId: string } }) {
  try {

    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.storeId) {
      return new NextResponse('storeId is required', { status: 400 })
    }

    const isExist = db.store.findUnique({
      where: {
        id: params.storeId,
        userId,
      }
    })

    if (!isExist) {
      return new NextResponse(`Invalid storeID. This store does not exist`, { status: 400 })
    }



    const category = await db.category.findUnique({
      where: {
        id: params.categoryId,
      }
    })

    return NextResponse.json(category)

  } catch (error) {
    console.log('[CATEGORY_GET]', error);

    return new NextResponse("Internal error", { status: 500 })

  }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, categoryId: string } }) {
  try {

    const { userId } = auth()
    const { name, billboardId } = await req.json()



    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!name || !billboardId) {
      return new NextResponse(`Label and ImageUrl is required`, { status: 400 })
    }


    if (!params.storeId) {
      return new NextResponse('storeId is required', { status: 400 })
    }

    const isExist = db.store.findUnique({
      where: {
        id: params.storeId,
        userId,
      }
    })

    if (!isExist) {
      return new NextResponse(`Invalid storeID. This store does not exist`, { status: 400 })
    }


    const category = await db.category.updateMany({
      where: {
        id: params.categoryId
      },
      data: {
        name,
        billboardId,
      }
    })



    return NextResponse.json({ name, billboardId })

  } catch (error) {
    console.log('[BILLBOARD_PATCH]', error);

    return new NextResponse("Internal error", { status: 500 })

  }
}




export async function DELETE(req: Request, { params }: { params: { storeId: string, categoryId: string } }) {
  try {

    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.storeId) {
      return new NextResponse('storeId is required', { status: 400 })
    }

    const isExist = db.store.findUnique({
      where: {
        id: params.storeId,
        userId,
      }
    })

    if (!isExist) {
      return new NextResponse(`Invalid storeID. This store does not exist`, { status: 400 })
    }



    const category = await db.category.deleteMany({
      where: {
        id: params.categoryId,
      }
    })

    return NextResponse.json(category)

  } catch (error) {
    console.log('[STORE_DELETE]', error);

    return new NextResponse("Internal error", { status: 500 })

  }
}