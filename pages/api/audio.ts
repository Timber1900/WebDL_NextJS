import type { NextApiRequest, NextApiResponse } from 'next';
import ytdl from 'ytdl-core';

interface VideoResponce {
  message?: string
}

export default async function audioHandler(req: NextApiRequest, res: NextApiResponse<VideoResponce>) {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })
    return
  }
  const { url, formats } = req.body;

  const format = await ytdl.chooseFormat(formats, { quality: 'highestaudio', filter: vid => !vid.hasVideo })
  const audio = await ytdl(url, { format })

  res.setHeader('Content-Length', format.contentLength)
  audio.pipe(res)
}
