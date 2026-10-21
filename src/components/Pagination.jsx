/** page — 0-based, как на сервере. В интерфейсе нумерация с 1. */
function pageWindow(current, total) {
  const pages = new Set([0, total - 1, current - 1, current, current + 1])
  const sorted = [...pages].filter((p) => p >= 0 && p < total).sort((a, b) => a - b)
  const result = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push('gap-' + p)
    result.push(p)
  })
  return result
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  return (
    <nav className="pagination" aria-label="Страницы">
      <button className="btn btn--ghost" disabled={page === 0} onClick={() => onChange(page - 1)}>
        Назад
      </button>
      {pageWindow(page, totalPages).map((item) =>
        typeof item === 'string' ? (
          <span key={item} className="pagination__gap">…</span>
        ) : (
          <button
            key={item}
            className={'pagination__page' + (item === page ? ' is-current' : '')}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onChange(item)}
          >
            {item + 1}
          </button>
        ),
      )}
      <button className="btn btn--ghost" disabled={page === totalPages - 1} onClick={() => onChange(page + 1)}>
        Вперёд
      </button>
    </nav>
  )
}
