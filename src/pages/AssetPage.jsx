import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ASSET_TYPES, fetchAsset, formatPrice, formatSize } from '../api.js'
import './AssetPage.css'

export default function AssetPage() {
  const { id } = useParams()
  const [asset, setAsset] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setAsset(null)
    setError(null)
    fetchAsset(id)
      .then((a) => !cancelled && setAsset(a))
      .catch((e) => !cancelled && setError(e.message))
    return () => { cancelled = true }
  }, [id])

  const ext = asset?.fileName.split('.').pop().toLowerCase()

  return (
    <main>
      <Link to="/" className="back">К списку ассетов</Link>

      {error && <p className="notice" role="alert">{error}</p>}
      {!asset && !error && <p className="notice">Загрузка…</p>}

      {asset && (
        <article className="asset">
          <div className="asset__preview">
            {asset.previewUrl
              ? <img src={asset.previewUrl} alt={asset.title} />
              : <span className="card__ext">.{ext}</span>}
          </div>

          <div className="asset__info">
            <p className="asset__type">{ASSET_TYPES[asset.type]}</p>
            <h1>{asset.title}</h1>
            <p className="asset__price">{formatPrice(asset.price)}</p>

            <a className="btn" href={asset.downloadUrl} download>Скачать</a>

            {asset.description && <p className="asset__desc">{asset.description}</p>}

            <dl className="asset__details">
              <dt>Файл</dt><dd>{asset.fileName}</dd>
              <dt>Формат</dt><dd>{ext}</dd>
              <dt>Размер</dt><dd>{formatSize(asset.fileSize)}</dd>
              <dt>Добавлен</dt><dd>{new Date(asset.createdAt).toLocaleDateString('ru-RU')}</dd>
            </dl>
          </div>
        </article>
      )}
    </main>
  )
}