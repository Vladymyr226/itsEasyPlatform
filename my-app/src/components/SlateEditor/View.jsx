import React, { useCallback, useMemo, useState } from 'react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { Slate, Editable, withReact } from 'slate-react'
import { getMarked, getBlock } from './utils/SlateUtilityFunctions.js'
import withLinks from './plugins/withLinks.js'
import withTables from './plugins/withTable.js'
import withEmbeds from './plugins/withEmbeds.js'
import withEquation from './plugins/withEquation.js'
import './Editor.css'

const Element = (props) => {
  return getBlock(props)
}

const SlateView = (props) => {
  const editor = useMemo(
    () => withEquation(withHistory(withEmbeds(withTables(withLinks(withReact(createEditor())))))),
    []
  )

  const handleEditorChange = (newValue) => {
    props.setValue(newValue)
  }

  const renderElement = useCallback((props) => <Element {...props} />, [])

  const [htmlAction, setHtmlAction] = useState({
    showInput: false,
    html: '',
    action: '',
    location: '',
  })
  const handleCodeToText = (partialState) => {
    setHtmlAction((prev) => ({
      ...prev,
      ...partialState,
    }))
  }

  return (
    <>
      {typeof props.value != 'undefined' ? (
        <Slate editor={editor} initialValue={props.value}>
          <Editable readOnly renderElement={renderElement} />
        </Slate>
      ) : (
        <></>
      )}
    </>
  )
}

export default SlateView
