type VideoProps = {
  url: string
}

const Video = ({ url }: VideoProps) => {
  return <video controls src={`${url}`} style={{ width: '100%' }} />
}

export default Video
