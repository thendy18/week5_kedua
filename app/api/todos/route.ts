// app/api/todos/route.ts
import { prismaClient } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const todos = await prismaClient.todo.findMany() // ✅ Sekarang todo ada
    return NextResponse.json(todos)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { title } = await request.json()
    const newTodo = await prismaClient.todo.create({ // ✅ Sekarang todo ada
      data: { title }
    })
    return NextResponse.json(newTodo, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prismaClient.todo.delete({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}