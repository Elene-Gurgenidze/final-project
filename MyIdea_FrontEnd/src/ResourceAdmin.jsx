
import { useEffect, useState } from 'react'
import { uploadImage } from './uploadImage'
import './admin/Admin.css';
const API_URL = import.meta.env.VITE_API_URL

function emptyForm(fields) {
  const form = {}

  for (const f of fields) {
    if (f.type === 'checkbox') form[f.name] = true
    else if (f.type === 'images') form[f.name] = []
    else if (f.type === 'image') form[f.name] = { url: '', publicId: '' }
    else form[f.name] = ''
  }

  return form
}

function toFormValue(field, value) {
  if (value === undefined || value === null) {
    return emptyForm([field])[field.name]
  }

  if (field.type === 'select' && typeof value === 'object') {
    return value._id
  }

  return value
}

export default function ResourceAdmin({ resource, title, fields, columns }) {
  const [items, setItems] = useState([])
  const [options, setOptions] = useState({})
  const [form, setForm] = useState(() => emptyForm(fields))
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    fetch(`${API_URL}/api/${resource}`)
      .then((res) => {
        if (!res.ok) throw new Error('Could not load records')
        return res.json()
      })
      .then(setItems)
      .catch((err) => setError(err.message))
  }, [resource, reloadKey])

  useEffect(() => {
    for (const f of fields.filter((f) => f.type === 'select' && f.optionsFrom)) {
      fetch(`${API_URL}/api/${f.optionsFrom}`)
        .then((res) => {
          if (!res.ok) throw new Error('Could not load options')
          return res.json()
        })
        .then((list) => setOptions((prev) => ({ ...prev, [f.name]: list })))
        .catch((err) => setError(err.message))
    }
  }, [fields])

  function load() {
    setReloadKey((k) => k + 1)
  }

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function startEdit(item) {
    const next = {}

    for (const f of fields) {
      if (f.type === 'image') {
        next[f.name] = {
          url: item.image || '',
          publicId: item.imagePublicId || '',
        }
      } else if (f.type === 'images') {
        next[f.name] = item[f.name] || []
      } else {
        next[f.name] = toFormValue(f, item[f.name])
      }
    }

    setForm(next)
    setEditingId(item._id)
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function reset() {
    setForm(emptyForm(fields))
    setEditingId(null)
    setError('')
  }

  async function handleFiles(field, files) {
    if (!files || !files.length) return

    setUploading(true)
    setError('')

    try {
      if (field.type === 'image') {
        const uploaded = await uploadImage(files[0])
        setField(field.name, uploaded)
      } else {
        const uploaded = []

        for (const imageFile of files) {
          uploaded.push(await uploadImage(imageFile))
        }

        setForm((prev) => ({
          ...prev,
          [field.name]: [...(prev[field.name] || []), ...uploaded],
        }))
      }
    } catch (err) {
      setError(err.message || 'Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const body = {}

    for (const f of fields) {
      const value = form[f.name]

      if (f.type === 'image') {
        body.image = value?.url || undefined
        body.imagePublicId = value?.publicId || undefined
      } else if (f.type === 'images') {
        body[f.name] = value || []
      } else if (f.type === 'number') {
        body[f.name] = value === '' ? undefined : Number(value)
      } else if (value === '' && f.type !== 'checkbox') {
        body[f.name] = undefined
      } else {
        body[f.name] = value
      }
    }

    try {
      const res = await fetch(
        `${API_URL}/api/${resource}${editingId ? `/${editingId}` : ''}`,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Something went wrong')
        return
      }

      reset()
      load()
    } catch (err) {
      setError(err.message || 'Could not save record')
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name || item.title || 'this item'}"?`
    )

    if (!confirmed) return

    setError('')

    try {
      const res = await fetch(`${API_URL}/api/${resource}/${item._id}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Could not delete')
        return
      }

      if (editingId === item._id) reset()
      load()
    } catch (err) {
      setError(err.message || 'Could not delete record')
    }
  }

  return (
    <section className="admin-resource">
      <div className="admin-form-card">
        <div className="admin-section-heading">
          <div>
            <span className="admin-eyebrow">
              {editingId ? 'UPDATE RECORD' : 'CONTENT MANAGEMENT'}
            </span>
            <h2 className="admin-card-heading">{title}</h2>
          </div>

          <span className="admin-count">{items.length} records</span>
        </div>

        {error && (
          <div className="admin-error" role="alert">
            {error}
          </div>
        )}

        <form className="admin-form" onSubmit={handleSubmit}>
          <h3 className="admin-form-title">
            {editingId ? 'Edit record' : 'Create new record'}
          </h3>

          {fields.map((f) => (
            <label key={f.name} className="admin-field">
              <span>{f.label || f.name}</span>

              {f.type === 'textarea' && (
                <textarea
                  value={form[f.name] ?? ''}
                  onChange={(e) => setField(f.name, e.target.value)}
                />
              )}

              {f.type === 'checkbox' && (
                <span className="admin-checkbox-row">
                  <input
                    type="checkbox"
                    checked={!!form[f.name]}
                    onChange={(e) => setField(f.name, e.target.checked)}
                  />
                  <span>Enabled</span>
                </span>
              )}

              {f.type === 'select' && (
                <select
                  value={form[f.name] ?? ''}
                  onChange={(e) => setField(f.name, e.target.value)}
                >
                  <option value="">Choose...</option>

                  {(f.options || options[f.name] || []).map((option) => {
                    const isString = typeof option === 'string'
                    const value = isString ? option : option._id
                    const label = isString
                      ? option
                      : option[f.optionLabel || 'name']

                    return (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  })}
                </select>
              )}

              {f.type === 'image' && (
                <div className="admin-upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={(e) => {
                      handleFiles(f, e.target.files)
                      e.target.value = ''
                    }}
                  />

                  {uploading && (
                    <p className="admin-upload-status">Uploading image...</p>
                  )}

                  {form[f.name]?.url && (
                    <div className="admin-image-preview">
                      <img src={form[f.name].url} alt="Preview" />

                      <button
                        className="admin-btn admin-btn-danger"
                        type="button"
                        onClick={() =>
                          setField(f.name, { url: '', publicId: '' })
                        }
                      >
                        Remove image
                      </button>
                    </div>
                  )}
                </div>
              )}

              {f.type === 'images' && (
                <div className="admin-upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={uploading}
                    onChange={(e) => {
                      handleFiles(f, [...e.target.files])
                      e.target.value = ''
                    }}
                  />

                  <div className="admin-gallery-preview">
                    {(form[f.name] || []).map((img) => (
                      <div key={img.publicId || img.url}>
                        <img src={img.url} alt="Uploaded image" />

                        <button
                          className="admin-btn admin-btn-danger"
                          type="button"
                          onClick={() =>
                            setField(
                              f.name,
                              form[f.name].filter(
                                (i) => i.publicId !== img.publicId
                              )
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {['text', 'number', 'email', 'date'].includes(f.type) && (
                <input
                  type={f.type}
                  value={form[f.name] ?? ''}
                  onChange={(e) => setField(f.name, e.target.value)}
                />
              )}
            </label>
          ))}

          <div className="admin-actions">
            <button
              className="admin-btn admin-btn-primary"
              type="submit"
              disabled={uploading}
            >
              {uploading
                ? 'Uploading...'
                : editingId
                  ? 'Save changes'
                  : 'Create'}
            </button>

            {editingId && (
              <button
                className="admin-btn admin-btn-secondary"
                type="button"
                onClick={reset}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-table-card">
        <div className="admin-section-heading">
          <div>
            <span className="admin-eyebrow">YOUR CONTENT</span>
            <h2 className="admin-card-heading">All records</h2>
          </div>

          <span className="admin-count">{items.length} total</span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>
                    {column.label || column.key}
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="admin-empty-state"
                  >
                    No records found yet.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id}>
                    {columns.map((column) => (
                      <td key={column.key}>
                        {column.render
                          ? column.render(item)
                          : String(item[column.key] ?? '')}
                      </td>
                    ))}

                    <td>
                      <div className="admin-table-actions">
                        <button
                          className="admin-btn admin-btn-secondary"
                          type="button"
                          onClick={() => startEdit(item)}
                        >
                          Edit
                        </button>

                        <button
                          className="admin-btn admin-btn-danger"
                          type="button"
                          onClick={() => handleDelete(item)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
