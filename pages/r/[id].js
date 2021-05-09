import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import Masonry from 'react-masonry-component'
import PostPopup from '../../components/PostPopup'
import { useState } from 'react'

/**
 * detemine if a post is image
 * @param {Object} post
 * @returns {Boolean}
 */
function isImagePost (post) {
  const url = post.url
  const imageExtensions = ['.jpg', '.png', '.gif']
  var dotIndex = url.lastIndexOf('.')
  var ext = url.substring(dotIndex)
  console.log(ext)
  if (imageExtensions.map(e => e === ext).filter(x => x).length !== 0)
    return true
  return false
}

const isServer = () => typeof window === 'undefined'

/**
 * get thumbnail url from a reddit post Object/dictionary
 * @param {Object} post
 * @param {Number} minWidth - min width of image to return
 * @returns {String}
 */
function getThumb (post, minWidth = 320) {
  if (post.preview && post.preview.enabled) {
    try {
      for (const preview of post.preview.images[0].resolutions) {
        if (preview.width >= minWidth)
          return { ...preview, url: preview.url.replaceAll('amp;', '') }
      }
    } catch (err) {
      console.log(post.preview.images)
    }
  }

  return false
}
const masonryOptions = {
  transitionDuration: 0,
  fitWidth: true
}
export default ({ posts }) => {
  if (!posts) return <>Loading...</>
  const router = useRouter()
  const title = <title> {router.query.id} </title>
  const [selected, setSelected] = useState(undefined)
  posts = posts.filter(p => isImagePost(p.data))

  const imageList = []
  for (const p of posts) {
    const imgData = getThumb(p.data)
    if (!imgData) continue
    const clickHandler = () => setSelected(p.data)
    imageList.push(
      <Link shallow={true} href={p.data.permalink || ''}>
        <a>
          <div
            // onClick={clickHandler}
            style={{ position: 'relative', margin: '5px', cursor: 'pointer' }}
          >
            <img
              width={imgData.width / 2}
              height={imgData.height / 2}
              style={{
                borderRadius: '5px'
              }}
              src={imgData.url}
            />
            <p
              style={{
                position: 'absolute',
                bottom: 0,
                margin: 0,
                color: '#FFF',
                background: 'rgba(0,0,0,0.3)'
              }}
            >
              {p.data.title.slice(0, 40)}
            </p>
          </div>
        </a>
      </Link>
    )
  }
  const images = (
    <Masonry
      className={'my-gallery-class'} // default ''
      options={masonryOptions} // default {}
      disableImagesLoaded={false} // default false
      updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
      //   imagesLoadedOptions={imagesLoadedOptions} // default {}
    >
      {imageList}
    </Masonry>
  )
  const popupCloseHanlder = () => setSelected(undefined)

  return (
    <>
      <Head>
        {title}
        <link rel='stylesheet' href='/main.css' />
      </Head>
      {/* {selected ? <PostPopup onClose={popupCloseHanlder} {...selected} /> : ''} */}
      <div style={{ filter: selected ? 'blur(4px)' : 'blur(0px)' }}>
        <h1>Subreddit: {router.query.id}</h1>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {images}
        </div>
      </div>
    </>
  )
}

export async function getStaticProps ({ params }) {
  const res = await fetch(`https://reddit.com/r/${params.id}/.json`)
  const json = await res.json()
  return {
    props: {
      posts: json?.data?.children || []
    },
    revalidate: 3600
  }
}

export async function getStaticPaths () {
  return { paths: ['/r/aww'], fallback: true }
}
