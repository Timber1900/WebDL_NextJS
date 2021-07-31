import type { NextApiRequest, NextApiResponse } from 'next';
import ytdl from 'ytdl-core';

interface VideoResponce {
  message?: string
  percent?: any,
  downloadedMinutes?: any,
  estimatedDownloadTime?: any
}

export default async function videoHandler(req: NextApiRequest, res: NextApiResponse<VideoResponce>) {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })
    return
  }
  const { url, formats } = req.body;

  const format = await ytdl.chooseFormat(formats, { quality: 'highestvideo' })
  const video = await ytdl(url, { format })


  res.setHeader('Content-Length', format.contentLength)
  video.pipe(res)
}
