import * as AWS from 'aws-sdk'
import { Language } from './interfaces'
import axios, { AxiosResponse } from 'axios'

export const languages: Language[] = ['EN', 'RU', 'UA', 'PL', 'ES']

export const langNames: Record<Language, string> ={
  EN: 'English',
  RU: 'Russian',
  UA: 'Ukrainian',
  PL: 'Polish',
  ES: 'Spanish',
}

export const uploadFileToS3 = async (file: File) => {
  if (
    !process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ||
    !process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ||
    !process.env.NEXT_PUBLIC_AWS_BUCKET_NAME
  ) {
    throw new Error('Отсутствуют переменные окружения NEXT_PUBLIC_AWS_ACCESS_KEY_ID или NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY'
      + ' или NEXT_PUBLIC_AWS_BUCKET_NAME')
  }

  AWS.config.update({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    region: 'eu-west-3',
  })

  const s3 = new AWS.S3()
  const uploadParams = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME ?? '',
    Key: `${file.name}`,
    Body: file,
    ContentType: file.type,
    ACL: 'public-read',
  }

  return new Promise((resolve, reject) => {
    s3.upload(uploadParams, (err: any, data: any) => {
      if (err) {
        console.error('Ошибка загрузки файла:', err)

        reject(`Ошибка загрузки файла: ${err}`)
      } else {
        console.log('Файл успешно загружен:', data.Location)
        resolve(data.Location)
      }
    })
  })
}

export const translateJson = async (
  content: Record<string, unknown>, language: Language
): Promise<Record<string, unknown> | void> => {
  
  const url = 'https://api.openai.com/v1/chat/completions'
  const apiKey =
    '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'

  try {
    const response: AxiosResponse<any, any> = await axios.post(
      url,
      {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that translates text in JSON structures.'},
          { role: 'user', content: `
              Translate the text content in the following JSON structure to ${langNames[language]}
              without changing the JSON structure:   
              ${JSON.stringify(content)}`
          }
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.status === 200) {
      return JSON.parse(
        response.data.choices[0].message.content
          .replace('```json', '')
          .replace('```', '')
      )
    }

  } catch (error) {
    console.error('Ошибка при отправке запроса:', error)
  }
}
