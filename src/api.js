export async function fetchAssets(page, size = 12) {
  const res = await fetch(`/api/assets?page=${page}&size=${size}`)
  if (!res.ok) throw new Error('Не удалось загрузить ассеты')
  return res.json()
}

/** Загрузка через XHR, чтобы показывать прогресс для больших файлов. */
export function uploadAsset(formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/assets')
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      let body = null
      try { body = JSON.parse(xhr.responseText) } catch { /* пустой ответ */ }
      if (xhr.status >= 200 && xhr.status < 300) resolve(body)
      else reject({ message: body?.message ?? 'Ошибка загрузки', fields: body?.fields ?? {} })
    }
    xhr.onerror = () => reject({ message: 'Нет связи с сервером', fields: {} })
    xhr.send(formData)
  })
}

export async function fetchAsset(id) {
  const res = await fetch(`/api/assets/${id}`)
  if (res.status === 404) throw new Error('Ассет не найден')
  if (!res.ok) throw new Error('Не удалось загрузить ассет')
  return res.json()
}

export function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} КБ`
  return `${(bytes / 1024 / 1024).toFixed(1)} МБ`
}

export function formatPrice(price) {
  return Number(price) === 0 ? 'Бесплатно' : `$${Number(price).toFixed(2)}`
}

export const ASSET_TYPES = {
  MODEL_3D: '3D-модель',
  TEXTURE: 'Текстура',
  MATERIAL: 'Материал',
  ANIMATION: 'Анимация',
  SOUND: 'Звук',
  OTHER: 'Другое',
}
