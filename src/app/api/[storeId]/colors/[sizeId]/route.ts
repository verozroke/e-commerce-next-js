import db from '@/lib/prisma.db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from "next/server";



export async function GET(req: Request, { params }: { params: { storeId: string, colorId: string } }) {
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



    const color = await db.color.findUnique({
      where: {
        id: params.colorId,
      }
    })

    return NextResponse.json(color)

  } catch (error) {
    console.log('[COLOR_GET]', error);

    return new NextResponse("Internal error", { status: 500 })

  }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, colorId: string } }) {
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


    const color = await db.color.updateMany({
      where: {
        id: params.colorId
      },
      data: {
        name,
        value,
      }
    })



    return NextResponse.json({ name, value })

  } catch (error) {
    console.log('[COLOR_PATCH]', error);

    return new NextResponse("Internal error", { status: 500 })

  }
}




export async function DELETE(req: Request, { params }: { params: { storeId: string, colorId: string } }) {
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



    const color = await db.color.deleteMany({
      where: {
        id: params.colorId,
      }
    })

    return NextResponse.json(color)

  } catch (error) {
    console.log('[COLOR_DELETE]', error);

    return new NextResponse("Internal error", { status: 500 })

  }
}