import { Link } from 'react-router-dom'
import { formatPrice, formatSize } from '../api.js'
import { ASSET_TYPES } from '../api.js'

export default function AssetCard({ asset }) {
  const ext = asset.fileName.split('.').pop().toLowerCase()

  return (
    <article className="card">
      <div className="card__preview">
        <Link to={`assets/${asset.id}`} className='card__preview'>
          {asset.previewUrl ? (
            <img src={asset.previewUrl} alt={asset.title} loading="lazy" />
          ) : (
            <span className="card__ext">.{ext}</span>
          )}
        </Link>
      </div>
      <div className="card__body">
        <h2 className="card__title">
          <Link to={`assets/${asset.id}`}>{asset.title}</Link>
        </h2>
        {asset.description && <p className="card__desc">{asset.description}</p>}
        <div className="card__meta">
          <span className="card__price">{formatPrice(asset.price)}</span>
          <span>{ext}, {formatSize(asset.fileSize)}</span>
          <span className="card__type">{ASSET_TYPES[asset.type]}</span>
        </div>
        <a className="btn btn--ghost" href={asset.downloadUrl} download>Скачать</a>
      </div>
    </article>
  )
}
