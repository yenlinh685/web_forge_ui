'use client'

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Check, Copy } from 'lucide-react'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

import { Button } from '../ui/button'

interface MarkdownProps {
    children: string
}

interface CodeBlockProps {
    language: string
    value: string
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }

    return (
        <div className="group relative my-2 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="absolute top-2 right-2 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <Button onClick={handleCopy} variant={'secondary'} size={'icon'}>
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>
            <SyntaxHighlighter
                style={prism}
                language={language}
                PreTag="div"
                showLineNumbers={true}
                className="my-0! rounded-lg! bg-[#f2f9ff]! px-4! py-3! text-sm!"
                codeTagProps={{
                    style: {
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        display: 'block',
                    },
                }}
                customStyle={{
                    overflowX: 'auto',
                    maxWidth: '100%',
                }}
            >
                {value}
            </SyntaxHighlighter>
        </div>
    )
}

const Markdown: React.FC<MarkdownProps> = ({ children }) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                h1: ({ children }) => <h1 className="mb-2 text-3xl font-bold">{children}</h1>,
                h2: ({ children }) => <h2 className="mb-2 text-2xl font-bold">{children}</h2>,
                h3: ({ children }) => <h3 className="mb-1 text-lg font-bold">{children}</h3>,
                ul: ({ children }) => <ul className="mb-2 ml-4 list-disc last:mb-0">{children}</ul>,
                ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal last:mb-0">{children}</ol>,
                li: ({ children }) => <li className="mb-1 last:mb-0">{children}</li>,
                a: ({ href, children }) => (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline dark:text-blue-400"
                    >
                        {children}
                    </a>
                ),
                code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '')
                    const codeString = String(children).replace(/\n$/, '')

                    if (match) {
                        return <CodeBlock language={match[1]} value={codeString} />
                    }

                    return (
                        <code className="rounded bg-cyan-200/60 px-1 py-0.5" {...props}>
                            {children}
                        </code>
                    )
                },
                pre: ({ children }) => <>{children}</>,
                blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-gray-300 pl-3 italic dark:border-gray-600">
                        {children}
                    </blockquote>
                ),
                hr: () => <hr className="my-3" />,
            }}
        >
            {children}
        </ReactMarkdown>
    )
}

export default Markdown
