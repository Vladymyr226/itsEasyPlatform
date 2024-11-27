import React, { useCallback, useState } from 'react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { Slate, Editable, withReact } from 'slate-react'
import Toolbar from './Toolbar/Toolbar'
import { getMarked, getBlock } from './utils/SlateUtilityFunctions.js'
import withLinks from './plugins/withLinks.js'
import withTables from './plugins/withTable.js'
import withEmbeds from './plugins/withEmbeds.js'
import withEquation from './plugins/withEquation.js'
import './Editor.css'
import CodeToText from './Elements/CodeToText/CodeToText'

const Element = (props) => {
  return getBlock(props)
}

const Leaf = ({ attributes, children, leaf }) => {
  children = getMarked(leaf, children)
  return <span {...attributes}>{children}</span>
}

const SlateEditor = (props) => {
  const [editor] = useState(
    () => withEquation(withHistory(withEmbeds(withTables(withLinks(withReact(createEditor())))))),
  )

  const [htmlAction, setHtmlAction] = useState({
    showInput: false,
    html: '',
    action: '',
    location: '',
  })

  const renderElement = useCallback((props) => <Element {...props} />, [])

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />
  }, [])

  const handleEditorChange = (newValue) => {
    props.setValue(newValue)
  }

  const handleCodeToText = (partialState) => {
    setHtmlAction((prev) => ({
      ...prev,
      ...partialState,
    }))
  }

  if (typeof props.value == 'undefined') return <></>

  return <>
    <Slate editor={editor} initialValue={props.value} onChange={handleEditorChange}>
      <Toolbar handleCodeToText={handleCodeToText} />
      <div
        className='editor-wrapper'
        style={{ border: '1px solid #f3f3f3', padding: '0 10px' }}
      >
        <Editable
          placeholder='Write something'
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          style={{ paddingLeft: '4px', minHeight: '380px' }}
        />
      </div>
      {htmlAction.showInput && (
        <CodeToText {...htmlAction} handleCodeToText={handleCodeToText} />
      )}
    </Slate>
  </>
}

export default SlateEditor
