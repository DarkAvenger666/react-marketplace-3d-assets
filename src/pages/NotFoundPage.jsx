import { Link } from "react-router-dom"
import './NotFoundPage.css'

export default function NotFoundPage() {
    return (
    <main className="not-found">
      <div className="not-found__grid" aria-hidden="true">
        <span>404</span>
      </div>
      <h1>Страница не найдена</h1>
      <p>Такого адреса нет, или ассет удалён. Проверьте ссылку или вернитесь к списку.</p>
      <Link to="/" className="btn">К списку ассетов</Link>
    </main>
  )
}