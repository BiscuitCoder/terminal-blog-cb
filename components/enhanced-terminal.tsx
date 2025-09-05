"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"

interface BlogPost {
  id: string
  title: string
  content: string
  date: string
  author: string
  tags: string[]
}

const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "Welcome to Terminal Blog",
    content:
      'This is a retro-style terminal blog where you interact using commands. Type "help" to see available commands.',
    date: "2024-01-15",
    author: "admin",
    tags: ["welcome", "terminal", "blog"],
  },
  {
    id: "2",
    title: "The Art of Command Line",
    content:
      "Command line interfaces have a timeless appeal. They represent efficiency, power, and a direct connection to the machine.",
    date: "2024-01-10",
    author: "hacker",
    tags: ["cli", "programming", "retro"],
  },
  {
    id: "3",
    title: "Green Screen Nostalgia",
    content:
      "There's something magical about green text on a black screen. It takes us back to the early days of computing.",
    date: "2024-01-05",
    author: "retrodev",
    tags: ["nostalgia", "design", "history"],
  },
]

const colors = {
  primary: "#00ff00",
  secondary: "#00aa00",
  accent: "#ffff00",
  error: "#ff0000",
  info: "#00ffff",
  muted: "#888888",
  white: "#ffffff",
}

export default function EnhancedTerminal() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<Array<{ text: string; color?: string }>>([
    { text: "Terminal Blog v2.0.0", color: colors.accent },
    { text: "Welcome to the retro terminal blog experience!", color: colors.info },
    { text: "" },
    { text: "Available commands:", color: colors.accent },
    { text: "  help          - Show this help message", color: colors.primary },
    { text: "  ls            - List all blog posts", color: colors.primary },
    { text: "  cat <id>      - Read a specific post by ID", color: colors.primary },
    { text: "  search <term> - Search posts by title or content", color: colors.primary },
    { text: "  whoami        - Show current user", color: colors.primary },
    { text: "  date          - Show current date", color: colors.primary },
    { text: "  clear         - Clear the terminal", color: colors.primary },
    { text: "  about         - About this blog", color: colors.primary },
    { text: "  pwd           - Show current directory", color: colors.primary },
    { text: "  history       - Show command history", color: colors.primary },
    { text: "" },
    { text: 'Try "ls" to see all posts or "cat 1" to read the first post!', color: colors.info },
    { text: "" },
  ])
  const [currentPath] = useState("~")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  useEffect(() => {
    const handleClick = () => {
      inputRef.current?.focus()
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
      }
    }
  }

  const addOutput = (lines: Array<{ text: string; color?: string }>) => {
    setOutput((prev) => [...prev, ...lines])
  }

  const executeCommand = (cmd: string) => {
    const [command, ...args] = cmd.trim().toLowerCase().split(" ")
    const fullCommand = `${currentPath}$ ${cmd}`

    if (cmd.trim()) {
      setCommandHistory((prev) => [...prev, cmd.trim()])
      setHistoryIndex(-1)
    }

    let response: Array<{ text: string; color?: string }> = []

    switch (command) {
      case "help":
        response = [
          { text: "Available commands:", color: colors.accent },
          { text: "  help          - Show this help message", color: colors.primary },
          { text: "  ls            - List all blog posts", color: colors.primary },
          { text: "  cat <id>      - Read a specific post by ID", color: colors.primary },
          { text: "  search <term> - Search posts by title or content", color: colors.primary },
          { text: "  whoami        - Show current user", color: colors.primary },
          { text: "  date          - Show current date", color: colors.primary },
          { text: "  clear         - Clear the terminal", color: colors.primary },
          { text: "  about         - About this blog", color: colors.primary },
          { text: "  pwd           - Show current directory", color: colors.primary },
          { text: "  history       - Show command history", color: colors.primary },
          { text: "" },
        ]
        break

      case "ls":
        response = [
          { text: "Blog Posts:", color: colors.info },
          ...mockPosts.map((post) => ({
            text: `${post.id.padEnd(3)} ${post.date} ${post.title} [${post.author}]`,
            color: colors.white,
          })),
          { text: "" },
          { text: `Total: ${mockPosts.length} posts`, color: colors.info },
        ]
        break

      case "cat":
        const postId = args[0]
        if (!postId) {
          response = [{ text: "Usage: cat <post_id>", color: colors.error }]
        } else {
          const post = mockPosts.find((p) => p.id === postId)
          if (post) {
            response = [
              { text: `Title: ${post.title}`, color: colors.accent },
              { text: `Author: ${post.author}`, color: colors.secondary },
              { text: `Date: ${post.date}`, color: colors.muted },
              { text: `Tags: ${post.tags.join(", ")}`, color: colors.info },
              { text: "" },
              { text: post.content, color: colors.white },
              { text: "" },
            ]
          } else {
            response = [{ text: `Error: Post with ID '${postId}' not found`, color: colors.error }]
          }
        }
        break

      case "search":
        const searchTerm = args.join(" ")
        if (!searchTerm) {
          response = [{ text: "Usage: search <term>", color: colors.error }]
        } else {
          const results = mockPosts.filter(
            (post) =>
              post.title.toLowerCase().includes(searchTerm) ||
              post.content.toLowerCase().includes(searchTerm) ||
              post.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
          )
          if (results.length > 0) {
            response = [
              { text: `Found ${results.length} result(s):`, color: colors.info },
              ...results.map((post) => ({
                text: `${post.id.padEnd(3)} ${post.title} [${post.author}]`,
                color: colors.white,
              })),
              { text: "" },
            ]
          } else {
            response = [{ text: `No posts found matching '${searchTerm}'`, color: colors.error }]
          }
        }
        break

      case "whoami":
        response = [{ text: "guest", color: colors.primary }]
        break

      case "date":
        response = [{ text: new Date().toString(), color: colors.white }]
        break

      case "clear":
        setOutput([])
        return

      case "about":
        response = [
          { text: "Terminal Blog", color: colors.accent },
          { text: "A retro-style blog interface inspired by classic terminals.", color: colors.white },
          { text: "Built with love for the command line aesthetic.", color: colors.white },
          { text: "" },
          { text: "Author: Terminal Enthusiast", color: colors.secondary },
          { text: "Version: 2.0.0 (Enhanced)", color: colors.info },
          { text: "" },
        ]
        break

      case "pwd":
        response = [{ text: "/home/guest/blog", color: colors.info }]
        break

      case "history":
        response = [
          { text: "Command History:", color: colors.info },
          ...commandHistory.map((cmd, index) => ({
            text: `${(index + 1).toString().padStart(3)} ${cmd}`,
            color: colors.white,
          })),
          { text: "" },
        ]
        break

      case "":
        response = [{ text: "" }]
        break

      default:
        response = [{ text: `Command not found: ${command}. Type 'help' for available commands.`, color: colors.error }]
    }

    addOutput([{ text: fullCommand, color: colors.primary }, ...response])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      executeCommand(input)
      setInput("")
    }
  }

  return (
    <div className="min-h-screen bg-black text-green-400 p-4 font-mono">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 text-center">
          <div className="text-green-300 text-lg font-bold mb-2">
            ╔══════════════════════════════════════════════════════════════╗
          </div>
          <div className="text-green-300 text-lg font-bold mb-2">║ TERMINAL BLOG SYSTEM ║</div>
          <div className="text-green-300 text-lg font-bold mb-2">
            ╚══════════════════════════════════════════════════════════════╝
          </div>
        </div>

        <div className="bg-black border-2 border-green-500 rounded-lg shadow-2xl shadow-green-500/20 overflow-hidden">
          <div className="bg-green-900/20 px-4 py-2 border-b border-green-500/30 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 text-green-300 text-sm">terminal@blog:~$</span>
          </div>

          <div className="h-[70vh] flex flex-col">
            <div ref={outputRef} className="flex-1 p-4 overflow-y-auto terminal-scrollbar">
              {output.map((line, index) => (
                <div key={index} className="leading-relaxed text-sm" style={{ color: line.color || colors.primary }}>
                  {line.text}
                </div>
              ))}
            </div>

            <div className="border-t border-green-500/30 p-4">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <span className="text-green-400 font-bold">{currentPath}$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono"
                  placeholder="Type a command..."
                  autoFocus
                />
                <span className="cursor-blink text-green-400 font-bold">█</span>
              </form>
            </div>
          </div>
        </div>

        <div className="text-center mt-4 text-green-600 text-sm">
          Enhanced Terminal • Use ↑↓ for command history • Click anywhere to focus
        </div>
      </div>
    </div>
  )
}
