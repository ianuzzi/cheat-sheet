import { useMemo, type JSX } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import { remarkEntries } from './remarkEntries'

const PLUGINS = [remarkGfm, remarkDirective, remarkEntries]

// remark-directive requires `:::name` with no space after the colons. Authors
// naturally write `::: name`, so normalize the opener before parsing.
function normalize(md: string): string {
  return md.replace(/^(:{3,})[ \t]+(?=\w)/gm, '$1')
}

type Props = { markdown: string }

export function RenderMarkdown({ markdown }: Props): JSX.Element {
  const node = useMemo(
    () => (
      <ReactMarkdown remarkPlugins={PLUGINS} skipHtml={false}>
        {normalize(markdown)}
      </ReactMarkdown>
    ),
    [markdown]
  )
  return <div className="markdown-body">{node}</div>
}
