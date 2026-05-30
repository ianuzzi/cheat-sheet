import { useMemo, type JSX } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import { remarkEntries } from './remarkEntries'

const PLUGINS = [remarkGfm, remarkDirective, remarkEntries]

type Props = { markdown: string }

export function RenderMarkdown({ markdown }: Props): JSX.Element {
  const node = useMemo(
    () => (
      <ReactMarkdown remarkPlugins={PLUGINS} skipHtml={false}>
        {markdown}
      </ReactMarkdown>
    ),
    [markdown]
  )
  return <div className="markdown-body">{node}</div>
}
