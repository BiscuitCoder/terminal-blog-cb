"use client"

import { useEffect, useRef, useState } from "react"
import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import { WebLinksAddon } from "xterm-addon-web-links"
import "xterm/css/xterm.css"

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

export default function XTermTerminal() {
  const terminalRef = useRef<HTMLDivElement>(null)
  const terminal = useRef<Terminal | null>(null)
  const fitAddon = useRef<FitAddon | null>(null)
  const [currentInput, setCurrentInput] = useState("")
  const [currentPath] = useState("~")

  useEffect(() => {
    if (!terminalRef.current) return

    terminal.current = new Terminal({
      theme: {
        background: "#000000",
        foreground: "#00ff00",
        cursor: "#00ff00",
        cursorAccent: "#000000",
        selection: "#ffffff40",
        black: "#000000",
        red: "#ff0000",
        green: "#00ff00",
        yellow: "#ffff00",
        blue: "#0000ff",
        magenta: "#ff00ff",
        cyan: "#00ffff",
        white: "#ffffff",
        brightBlack: "#808080",
        brightRed: "#ff8080",
        brightGreen: "#80ff80",
        brightYellow: "#ffff80",
        brightBlue: "#8080ff",
        brightMagenta: "#ff80ff",
        brightCyan: "#80ffff",
        brightWhite: "#ffffff",
      },
      fontFamily: 'Geist Mono, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      fontSize: 14,
      lineHeight: 1.2,
      cursorBlink: true,
      cursorStyle: "block",
      scrollback: 1000,
      tabStopWidth: 4,
    })

    fitAddon.current = new FitAddon()
    terminal.current.loadAddon(fitAddon.current)
    terminal.current.loadAddon(new WebLinksAddon())

    terminal.current.open(terminalRef.current)
    fitAddon.current.fit()

    terminal.current.writeln("\x1b[1;32mTerminal Blog v1.0.0\x1b[0m")
    terminal.current.writeln('\x1b[36mType "help" for available commands.\x1b[0m')
    terminal.current.writeln("")
    writePrompt()

    terminal.current.onData((data) => {
      const char = data.charCodeAt(0)

      if (char === 13) {
        // Enter key
        terminal.current!.writeln("")
        if (currentInput.trim()) {
          executeCommand(currentInput.trim())
        }
        setCurrentInput("")
        writePrompt()
      } else if (char === 127) {
        // Backspace
        if (currentInput.length > 0) {
          terminal.current!.write("\b \b")
          setCurrentInput((prev) => prev.slice(0, -1))
        }
      } else if (char >= 32) {
        // Printable characters
        terminal.current!.write(data)
        setCurrentInput((prev) => prev + data)
      }
    })

    const handleResize = () => {
      fitAddon.current?.fit()
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      terminal.current?.dispose()
    }
  }, [])

  const writePrompt = () => {
    terminal.current?.write(`\x1b[1;32m${currentPath}$\x1b[0m `)
  }

  const executeCommand = (cmd: string) => {
    const [command, ...args] = cmd.toLowerCase().split(" ")

    switch (command) {
      case "help":
        terminal.current?.writeln("\x1b[1;33mAvailable commands:\x1b[0m")
        terminal.current?.writeln("  \x1b[32mhelp\x1b[0m          - Show this help message")
        terminal.current?.writeln("  \x1b[32mls\x1b[0m            - List all blog posts")
        terminal.current?.writeln("  \x1b[32mcat <id>\x1b[0m      - Read a specific post by ID")
        terminal.current?.writeln("  \x1b[32msearch <term>\x1b[0m - Search posts by title or content")
        terminal.current?.writeln("  \x1b[32mwhoami\x1b[0m        - Show current user")
        terminal.current?.writeln("  \x1b[32mdate\x1b[0m          - Show current date")
        terminal.current?.writeln("  \x1b[32mclear\x1b[0m         - Clear the terminal")
        terminal.current?.writeln("  \x1b[32mabout\x1b[0m         - About this blog")
        terminal.current?.writeln("  \x1b[32mpwd\x1b[0m           - Show current directory")
        terminal.current?.writeln("")
        break

      case "ls":
        terminal.current?.writeln("\x1b[1;36mBlog Posts:\x1b[0m")
        mockPosts.forEach((post) => {
          terminal.current?.writeln(
            `\x1b[33m${post.id.padEnd(3)}\x1b[0m \x1b[90m${post.date}\x1b[0m \x1b[37m${post.title}\x1b[0m \x1b[35m[${post.author}]\x1b[0m`,
          )
        })
        terminal.current?.writeln("")
        terminal.current?.writeln(`\x1b[36mTotal: ${mockPosts.length} posts\x1b[0m`)
        break

      case "cat":
        const postId = args[0]
        if (!postId) {
          terminal.current?.writeln("\x1b[31mUsage: cat <post_id>\x1b[0m")
        } else {
          const post = mockPosts.find((p) => p.id === postId)
          if (post) {
            terminal.current?.writeln(`\x1b[1;37mTitle: ${post.title}\x1b[0m`)
            terminal.current?.writeln(`\x1b[35mAuthor: ${post.author}\x1b[0m`)
            terminal.current?.writeln(`\x1b[90mDate: ${post.date}\x1b[0m`)
            terminal.current?.writeln(`\x1b[36mTags: ${post.tags.join(", ")}\x1b[0m`)
            terminal.current?.writeln("")
            terminal.current?.writeln(`\x1b[37m${post.content}\x1b[0m`)
            terminal.current?.writeln("")
          } else {
            terminal.current?.writeln(`\x1b[31mError: Post with ID '${postId}' not found\x1b[0m`)
          }
        }
        break

      case "search":
        const searchTerm = args.join(" ")
        if (!searchTerm) {
          terminal.current?.writeln("\x1b[31mUsage: search <term>\x1b[0m")
        } else {
          const results = mockPosts.filter(
            (post) =>
              post.title.toLowerCase().includes(searchTerm) ||
              post.content.toLowerCase().includes(searchTerm) ||
              post.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
          )
          if (results.length > 0) {
            terminal.current?.writeln(`\x1b[1;36mFound ${results.length} result(s):\x1b[0m`)
            results.forEach((post) => {
              terminal.current?.writeln(
                `\x1b[33m${post.id.padEnd(3)}\x1b[0m \x1b[37m${post.title}\x1b[0m \x1b[35m[${post.author}]\x1b[0m`,
              )
            })
            terminal.current?.writeln("")
          } else {
            terminal.current?.writeln(`\x1b[31mNo posts found matching '${searchTerm}'\x1b[0m`)
          }
        }
        break

      case "whoami":
        terminal.current?.writeln("\x1b[32mguest\x1b[0m")
        break

      case "date":
        terminal.current?.writeln(`\x1b[37m${new Date().toString()}\x1b[0m`)
        break

      case "clear":
        terminal.current?.clear()
        break

      case "about":
        terminal.current?.writeln("\x1b[1;32mTerminal Blog\x1b[0m")
        terminal.current?.writeln("\x1b[37mA retro-style blog interface inspired by classic terminals.\x1b[0m")
        terminal.current?.writeln("\x1b[37mBuilt with love for the command line aesthetic.\x1b[0m")
        terminal.current?.writeln("")
        terminal.current?.writeln("\x1b[35mAuthor: Terminal Enthusiast\x1b[0m")
        terminal.current?.writeln("\x1b[36mVersion: 2.0.0 (powered by xterm.js)\x1b[0m")
        terminal.current?.writeln("")
        break

      case "pwd":
        terminal.current?.writeln("\x1b[34m/home/guest/blog\x1b[0m")
        break

      case "":
        break

      default:
        terminal.current?.writeln(`\x1b[31mCommand not found: ${command}. Type 'help' for available commands.\x1b[0m`)
    }
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-6xl mx-auto">
        <div
          ref={terminalRef}
          className="h-[85vh] border border-green-500/30 rounded-lg overflow-hidden shadow-2xl shadow-green-500/20"
          style={{
            background: "linear-gradient(135deg, #000000 0%, #001100 100%)",
          }}
        />
        <div className="text-center mt-4 text-green-400/60 text-sm font-mono">
          Powered by xterm.js • Enhanced Terminal Experience
        </div>
      </div>
    </div>
  )
}
