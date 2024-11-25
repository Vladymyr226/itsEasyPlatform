import * as AWS from 'aws-sdk'
import { Language } from './interfaces'

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
