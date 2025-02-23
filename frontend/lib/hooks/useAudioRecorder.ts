import { useState, useRef } from 'react'

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          sampleSize: 16,
          volume: 1.0
        }
      })
      
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      audioChunks.current = []

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data)
        }
      }

      mediaRecorder.current.start(100) // Collect data every 100ms
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      throw error
    }
  }

  const stopRecording = (): Promise<Blob> => {
    return new Promise((resolve) => {
      if (!mediaRecorder.current) {
        resolve(new Blob())
        return
      }

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' })
        audioChunks.current = []
        resolve(audioBlob)
      }

      mediaRecorder.current.stop()
      setIsRecording(false)

      // Stop all tracks
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop())
    })
  }

  return {
    isRecording,
    startRecording,
    stopRecording
  }
} 