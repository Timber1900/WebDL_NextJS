import { createFFmpeg, FFmpeg } from "@ffmpeg/ffmpeg";
import { AxiosResponse } from "axios";

export interface progressEvent {
  ratio?: number;
  duration?: number;
  time?: number;
}


export default class FFMPEG_Helper {
  private ffmpeg: FFmpeg;
  public onProgress: (progessEvent: progressEvent) => void

  public constructor(log?: boolean) {
    this.ffmpeg = createFFmpeg({
      corePath: "/ffmpeg-core/dist/ffmpeg-core.js",
      log: log ?? false,
      progress: (p: progressEvent) => this.update_progess(p)
    });
  }

  private update_progess(progress: progressEvent) {
    this.onProgress(progress);
  }

  public async write_video(video_data: AxiosResponse<Blob>) {
    if(!this.ffmpeg.isLoaded()) throw new Error("ffmpeg is not loaded");
    try {
      this.ffmpeg.FS('writeFile', 'video.mkv', new Uint8Array(await video_data.data.arrayBuffer()));
    } catch (error) {
      throw error;
    }
  }

  public async write_audio(audio_data: AxiosResponse<Blob>) {
    if(!this.ffmpeg.isLoaded()) throw new Error("ffmpeg is not loaded");
    try {
      this.ffmpeg.FS('writeFile', 'audio.m4a', new Uint8Array(await audio_data.data.arrayBuffer()));
    } catch (error) {
      throw error;
    }
  }

  public async load() {
    try {
      await this.ffmpeg.load()
    } catch (error) {
      throw error;
    }
  }

  public async merge_video() {
    try {
      await this.ffmpeg.run('-i', 'audio.m4a', '-i', 'video.mkv','-map', '0:a','-map', '1:v', '-c:v', 'copy', 'out.mkv');
    } catch (error) {
      throw error;
    }
  }


  public get result() : Uint8Array {
    return this.ffmpeg.FS('readFile', 'out.mkv')
  }


  public get loaded() : boolean {
    return this.ffmpeg.isLoaded()
  }

}
