import { useRef, useState } from "react";
import ytdl from "ytdl-core";
import axios, { AxiosResponse } from "axios";
import FFMPEG_Helper, { progressEvent } from '../helpers/ffmpeg';
import download_file from "../helpers/download_file";

export default function Home() {
  const [info, setInfo] = useState<ytdl.videoInfo | null>()
  const [convertRatio, setConvertRatio] = useState(0);
  const [downloadRatio, setDownloadRatio] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null)
  const ffmpeg = new FFMPEG_Helper(false)

  const getInfo = async () => {
    let data: any = await fetch('/api/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({url: inputRef.current.value}),
    })
    const { info }: {info: ytdl.videoInfo} = await data.json();
    setInfo(info);
  }

  const getVideo = async () => {
    const dataArray: Promise<AxiosResponse<Blob>>[]  = [];
    dataArray.push(axios.post<Blob>('/api/video',
      { url: info.videoDetails.video_url, formats: info.formats },
      { onDownloadProgress: prg => {setDownloadRatio((prg.loaded / prg.total) * 100)},
        responseType: "blob",
        headers: {'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Embedder-Policy': 'require-corp'}
    }))

    dataArray.push(axios.post<Blob>('/api/audio',
      { url: info.videoDetails.video_url, formats: info.formats },
      { responseType: "blob",
        headers: {'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Embedder-Policy': 'require-corp'}
    }))

    Promise.all(dataArray)
    .then(async (res) => {
      const [audioData, videoData] = res.sort((a, b) => a.data.size - b.data.size);
      try {
        if(!ffmpeg.loaded) await ffmpeg.load()
        ffmpeg.onProgress = ({duration, ratio, time}: progressEvent) => {
          setConvertRatio(ratio * 100);
        }
        await ffmpeg.write_video(videoData)
        await ffmpeg.write_audio(audioData)
        await ffmpeg.merge_video()
        const data = ffmpeg.result;
        download_file(data, `${info.videoDetails.title}.mkv`)
      } catch (error) {
        console.error(error)
      }
    })
  }

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen gap-4 p-8 font-sans text-xl font-semibold text-black ">
      <div className="flex flex-row items-center justify-center w-full gap-4 p-4">
        <input ref={ inputRef } className="flex-grow px-2 py-1 bg-gray-300 rounded-md" type='text'/>
        <button onClick={ getInfo } className="px-2 py-1 transition-colors bg-blue-400 rounded-md w-max hover:bg-blue-500 active:bg-blue-600">
          Get Info
        </button>
      </div>
      {info &&
        <div className="grid w-full grid-cols-5 grid-rows-1 gap-4 p-4 m-4 h-max">
          <img src={info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url} alt='Thumbnail' className="col-span-2 rounded-md shadow-md"/>
          <div className="flex flex-col col-span-3">
            <h1 className="text-center">{info.videoDetails.title}</h1>
            <div className="grid w-full h-full gap-2 p-4 place-content-center">
              <button onClick={getVideo} className="px-2 py-1 bg-blue-400 rounded-md w-max hover:bg-blue-500 active:bg-blue-600">Download</button>
              <p>Download Ratio: {downloadRatio}</p>
              <p>Convert Ratio: {convertRatio}</p>
            </div>
          </div>
        </div>
      }
    </div>
  )
}
