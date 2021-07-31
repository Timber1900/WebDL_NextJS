import type { NextApiRequest, NextApiResponse } from 'next';
import ytdl from 'ytdl-core';

interface InfoResponce {
  info?: ytdl.videoInfo
  message?: string
}

export default async function infoHandler(req: NextApiRequest, res: NextApiResponse<InfoResponce>) {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })
    return
  }
  const { url } = req.body;

  const info = await ytdl.getInfo(url)

  res.send({ info })
}
