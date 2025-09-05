"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"

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

export default function Terminal() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<string[]>(["Terminal Blog v1.0.0", 'Type "help" for available commands.', ""])
  const [currentPath, setCurrentPath] = useState("~")
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

  const executeCommand = (cmd: string) => {
    const [command, ...args] = cmd.trim().toLowerCase().split(" ")
    const fullCommand = `${currentPath}$ ${cmd}`

    let response: string[] = []

    switch (command) {
      case "help":
        response = [
          "Available commands:",
          "  help          - Show this help message",
          "  ls            - List all blog posts",
          "  cat <id>      - Read a specific post by ID",
          "  search <term> - Search posts by title or content",
          "  whoami        - Show current user",
          "  date          - Show current date",
          "  clear         - Clear the terminal",
          "  about         - About this blog",
          "  pwd           - Show current directory",
          "",
        ]
        break

      case "ls":
        response = [
          "Blog Posts:",
          ...mockPosts.map((post) => `${post.id.padEnd(3)} ${post.date} ${post.title} [${post.author}]`),
          "",
          `Total: ${mockPosts.length} posts`,
        ]
        break

      case "cat":
        const postId = args[0]
        if (!postId) {
          response = ["Usage: cat <post_id>"]
        } else {
          const post = mockPosts.find((p) => p.id === postId)
          if (post) {
            response = [
              `Title: ${post.title}`,
              `Author: ${post.author}`,
              `Date: ${post.date}`,
              `Tags: ${post.tags.join(", ")}`,
              "",
              post.content,
              "",
            ]
          } else {
            response = [`Error: Post with ID '${postId}' not found`]
          }
        }
        break

      case "search":
        const searchTerm = args.join(" ")
        if (!searchTerm) {
          response = ["Usage: search <term>"]
        } else {
          const results = mockPosts.filter(
            (post) =>
              post.title.toLowerCase().includes(searchTerm) ||
              post.content.toLowerCase().includes(searchTerm) ||
              post.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
          )
          if (results.length > 0) {
            response = [
              `Found ${results.length} result(s):`,
              ...results.map((post) => `${post.id.padEnd(3)} ${post.title} [${post.author}]`),
              "",
            ]
          } else {
            response = [`No posts found matching '${searchTerm}'`]
          }
        }
        break

      case "whoami":
        response = ["guest"]
        break

      case "date":
        response = [new Date().toString()]
        break

      case "clear":
        setOutput([])
        return

      case "about":
        response = [
          "Terminal Blog",
          "A retro-style blog interface inspired by classic terminals.",
          "Built with love for the command line aesthetic.",
          "",
          "Author: Terminal Enthusiast",
          "Version: 1.0.0",
          "",
        ]
        break

      case "pwd":
        response = ["/home/guest/blog"]
        break

      case "":
        response = [""]
        break

      default:
        response = [`Command not found: ${command}. Type 'help' for available commands.`]
    }

    setOutput((prev) => [...prev, fullCommand, ...response])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      executeCommand(input)
      setInput("")
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <Card className="max-w-4xl mx-auto h-[80vh] bg-card border-border">
        <div className="h-full flex flex-col">
          <div ref={outputRef} className="flex-1 p-4 overflow-y-auto terminal-output font-mono text-sm">
            {output.map((line, index) => (
              <div key={index} className="leading-relaxed">
                {line}
              </div>
            ))}
          </div>

          <div className="border-t border-border p-4">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <span className="text-primary font-mono">{currentPath}$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-foreground font-mono"
                placeholder="Type a command..."
                autoFocus
              />
              <span className="cursor-blink text-primary">█</span>
            </form>
          </div>
        </div>
      </Card>

      <div className="text-center mt-4 text-muted-foreground text-sm">
        Click anywhere to focus • Press Enter to execute commands
      </div>
    </div>
  )
}
