import { useEffect, useRef, useState } from 'react'
import { uploadAsset } from '../api.js'

const MODEL_ACCEPT = '.glb,.gltf,.fbx,.obj,.blend,.stl,.zip'
const IMAGE_ACCEPT = '.png,.jpg,.jpeg,.webp'

export default function UploadDialog({ open, onClose, onUploaded }) {
  const dialogRef = useRef(null)
  const formRef = useRef(null)
  const [progress, setProgress] = useState(null)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const busy = progress !== null

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setProgress(0)
    try {
      await uploadAsset(new FormData(formRef.current), setProgress)
      formRef.current.reset()
      onUploaded()
    } catch (err) {
      setError(err.message)
      setFieldErrors(err.fields ?? {})
    } finally {
      setProgress(null)
    }
  }

  return (
    <dialog ref={dialogRef} className="dialog" onClose={onClose}>
      <form ref={formRef} onSubmit={handleSubmit} noValidate>
        <h2>Загрузить ассет</h2>

        <label>
          Название
          <input name="title" maxLength={120} required />
          {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
        </label>

        <label>
          Описание
          <textarea name="description" rows={3} maxLength={2000} />
          {fieldErrors.description && <span className="field-error">{fieldErrors.description}</span>}
        </label>

        <label>
          Цена, $ (0 — бесплатно)
          <input name="price" type="number" min="0" step="0.01" defaultValue="0" required />
          {fieldErrors.price && <span className="field-error">{fieldErrors.price}</span>}
        </label>

        <label>
          Файл модели
          <input name="file" type="file" accept={MODEL_ACCEPT} required />
          {fieldErrors.file && <span className="field-error">{fieldErrors.file}</span>}
        </label>

        <label>
          Превью (необязательно)
          <input name="preview" type="file" accept={IMAGE_ACCEPT} />
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}
        {busy && <progress value={progress} max="100" aria-label="Загрузка" />}

        <div className="dialog__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose} disabled={busy}>Отмена</button>
          <button type="submit" className="btn" disabled={busy}>
            {busy ? `Загрузка ${progress}%` : 'Загрузить'}
          </button>
        </div>
      </form>
    </dialog>
  )
}
