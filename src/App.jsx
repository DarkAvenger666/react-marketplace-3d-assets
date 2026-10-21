import { useCallback, useEffect, useState } from 'react'
import { fetchAssets } from './api.js'
import AssetCard from './components/AssetCard.jsx'
import Pagination from './components/Pagination.jsx'
import UploadDialog from './components/UploadDialog.jsx'

const PAGE_SIZE = 12

export default function App() {
  const [page, setPage] = useState(0)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploadOpen, setUploadOpen] = useState(false)

  const load = useCallback(async (p) => {
    setLoading(true)
    setError(null)
    try {
      setData(await fetchAssets(p, PAGE_SIZE))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(page) }, [page, load])

  function changePage(p) {
    setPage(p)
    window.scrollTo({ top: 0 })
  }

  function handleUploaded() {
    setUploadOpen(false)
    // новые ассеты идут первыми — возвращаемся на первую страницу
    if (page === 0) load(0)
    else setPage(0)
  }

  const assets = data?.content ?? []

  return (
    <>
      <header className="topbar">
        <h1>Ассеты</h1>
        <button className="btn" onClick={() => setUploadOpen(true)}>Загрузить ассет</button>
      </header>

      <main>
        {error && (
          <p className="notice" role="alert">
            {error} <button className="link" onClick={() => load(page)}>Повторить</button>
          </p>
        )}

        {!error && !loading && assets.length === 0 && (
          <p className="notice">Здесь пока пусто. Загрузите первый ассет.</p>
        )}

        <div className={'grid' + (loading ? ' is-loading' : '')} aria-busy={loading}>
          {assets.map((a) => <AssetCard key={a.id} asset={a} />)}
        </div>

        {data && <Pagination page={data.page} totalPages={data.totalPages} onChange={changePage} />}
      </main>

      <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} onUploaded={handleUploaded} />
    </>
  )
}
