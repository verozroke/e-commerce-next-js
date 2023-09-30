import db from '@/lib/prisma.db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from "next/server";



export async function GET(req: Request, { params }: { params: { storeId: string, sizeId: string } }) {
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



    const size = await db.size.findUnique({
      where: {
        id: params.sizeId,
      }
    })

    return NextResponse.json(size)

  } catch (error) {
    console.log('[SIZE_GET]', error);

    return new NextResponse("Internal error", { status: 500 })

  }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, sizeId: string } }) {
  try {

    const { userId } = auth()
    const { name, value } = await req.json()



    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!name || !value) {
      return new NextResponse(`Name and Value is required`, { status: 400 })
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


    const size = await db.size.updateMany({
      where: {
        id: params.sizeId
      },
      data: {
        name,
        value,
      }
    })



    return NextResponse.json({ name, value })

  } catch (error) {
    console.log('[SIZE_PATCH]', error);

    return new NextResponse("Internal error", { status: 500 })

  }
}




export async function DELETE(req: Request, { params }: { params: { storeId: string, sizeId: string } }) {
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



    const size = await db.size.deleteMany({
      where: {
        id: params.sizeId,
      }
    })

    return NextResponse.json(size)

  } catch (error) {
    console.log('[SIZE_DELETE]', error);

    return new NextResponse("Internal error", { status: 500 })

  }
}