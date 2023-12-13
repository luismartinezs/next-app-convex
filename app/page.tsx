"use client"
import { useMutation, useQuery } from "convex/react"
import { api } from "../convex/_generated/api"
import { SignInButton, SignOutButton, useAuth } from "@clerk/nextjs"
import { FormEvent, useState } from "react"
import { FaRegTrashAlt } from "react-icons/fa"

function AddTask() {
  const addTask = useMutation(api.tasks.add)
  const [newTask, setNewTask] = useState("")
  const [error, setError] = useState("")
  async function handleAddTask(event: FormEvent) {
    event.preventDefault()
    try {
      await addTask({ task: newTask })
      setNewTask("")
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleAddTask}>
      <label htmlFor="task">Add new task</label>
      <input
        type="text"
        name="task"
        placeholder="Enter task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        className="border border-gray-700 rounded px-2 py-1 text-white bg-gray-900 focus:border-gray-500 outline-none"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className="text-right bg-blue-500 py-1 px-2 rounded w-fit hover:bg-blue-600 cursor-pointer"
        disabled={!newTask}
      >
        Add
      </button>
    </form>
  )
}

function Content() {
  const { isLoaded, userId, sessionId, getToken } = useAuth()
  const tasks = useQuery(api.tasks.list) ?? []
  const removeTask = useMutation(api.tasks.remove)

  if (!isLoaded) {
    return <p>Loading...</p>
  }

  if (!userId) {
    return (
      <>
        <SignInButton mode="modal" />
      </>
    )
  }

  return (
    <>
      <p>
        Hello, {userId} your current active session is {sessionId}
      </p>
      <SignOutButton />
      <AddTask />
      <ul>
        {tasks?.map(({ _id, task }) => (
          <li key={_id} className="flex gap-4 justify-between">
            <span>{task}</span>
            <button onClick={() => removeTask({ id: _id })}>
              <FaRegTrashAlt />
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Content />
    </div>
  )
}
