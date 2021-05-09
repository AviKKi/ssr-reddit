export default ({ json }) => {
  const post = (json || [])[0]?.data.children[0]?.data
  if (post)
    return (
      <>
        <img src={post.url} style={{ maxWidth: '98vw' }} />
        {post.title}
      </>
    )
  else return <></>
}

export async function getStaticProps ({ params }) {
  const res = await fetch(
    `https://reddit.com/r/${params.id}/comments/${params.post_id}/${params.title}.json`
  )
  const json = await res.json()
  return {
    props: {
      json: json || []
    },
    revalidate: 3600
  }
}

export async function getStaticPaths () {
  return { paths: [], fallback: true }
}
