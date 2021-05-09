import { useRef } from 'react'
import classes from './index.module.css'
import useWindowSize from '../../utils/useWindowSize'
import useClickOutside from '../../utils/useClickOutside'

const PostPopup = ({ onClose, ...data }) => {
  const cardRef = useRef()
  useClickOutside(cardRef, () => onClose())
  const { width, height } = useWindowSize()
  console.log({ width, height })
  const resolutions = data.preview.images[0].resolutions.filter(i => {
    return i.width <= width && i.height <= height
  })
  const image = resolutions.pop() || data.preview.images[0].resolutions[0]
  const url = image.url.replace(/amp;/g, '')
  return (
    <div className={classes.container}>
      <div
        ref={cardRef}
        style={{ width: image.width }}
        className={classes.cardContainer}
      >
        <div className={classes.cardHeader}>{data.title}</div>
        <img src={url} className={classes.img} />
        <div className={classes.cardFooter}></div>
      </div>
    </div>
  )
}

export default PostPopup
