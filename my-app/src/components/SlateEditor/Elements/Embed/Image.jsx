import React from 'react'
import { useSelected, useFocused } from 'slate-react'
import Icon from '../../common/Icon'
import useResize from '../../utils/customHooks/useResize.js'

const Image = ({ attributes, element, children }) => {
  const { url, alt } = element
  const selected = useSelected()
  const focused = useFocused()
  const [size, onMouseDown] = useResize()

  return (
    <div {...attributes} className='embed' style={{ display: 'flex' }} {...element.attr}>
      <div contentEditable={false} style={{ width: `${size.width}px`, height: `${size.height}px` }}>
        <img alt='' src={url} />
        {selected && (
          <button
            onMouseDown={onMouseDown}
            style={{ width: '15px', height: '15px', background: 'transparent' }}
          >
            <Icon icon='resize' />
          </button>
        )}
      </div>
      {children}
    </div>
  )
}
export default Image
