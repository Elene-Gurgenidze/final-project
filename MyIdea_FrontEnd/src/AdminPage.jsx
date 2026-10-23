
import { useState } from 'react'
import ResourceAdmin from './ResourceAdmin'

// 1. სამოგზაურო მიმართულებები (Destination)
const destinationFields = [
	{ name: 'name', type: 'text' },
	{ name: 'country', type: 'text' },
	{ name: 'city', type: 'text' },
	{ name: 'description', type: 'textarea' },
	{
		name: 'category',
		type: 'select',
		options: ['nature', 'culture', 'food', 'hotel', 'other'],
	},
	{ name: 'rating', type: 'number' },
	{ name: 'image', type: 'image', label: 'Destination image' },
]

const destinationColumns = [
  { key: 'name' },
  { key: 'country' },
  { key: 'city' },
  { key: 'rating' },
]

// 2. კატეგორიები (Category)
const categoryFields = [
  { name: 'name', type: 'text' },
  { name: 'slug', type: 'text' },
  { name: 'description', type: 'textarea' },
]

const categoryColumns = [
  { key: 'name' },
  { key: 'slug' },
  { key: 'description' },
]

// 3. მოგზაურობები (Trips)
const tripFields = [
  { name: 'title', type: 'text' },
  { name: 'description', type: 'textarea' },
  { name: 'startDate', type: 'date' },
  { name: 'endDate', type: 'date' },
  {
    name: 'user',
    type: 'select',
    optionsFrom: 'users',
    optionLabel: 'name',
  },
]

const tripColumns = [
  { key: 'title' },
  {
    key: 'startDate',
    render: (t) => new Date(t.startDate).toLocaleDateString(),
  },
  {
    key: 'endDate',
    render: (t) => new Date(t.endDate).toLocaleDateString(),
  },
]

// 4. შეფასებები (Reviews)
const reviewFields = [
  { name: 'rating', type: 'number' },
  { name: 'comment', type: 'textarea' },
  {
    name: 'destination',
    type: 'select',
    optionsFrom: 'destinations',
    optionLabel: 'name',
  },
]

const reviewColumns = [
  { key: 'rating' },
  { key: 'comment' },
]

// 5. დღიური გეგმები (DayPlans)
const dayPlanFields = [
  { name: 'dayNumber', type: 'number' },
  { name: 'title', type: 'text' },
  { name: 'activities', type: 'textarea' },
  {
    name: 'trip',
    type: 'select',
    optionsFrom: 'trips',
    optionLabel: 'title',
  },
]

const dayPlanColumns = [
  { key: 'dayNumber' },
  { key: 'title' },
  { key: 'activities' },
]

// 6. მომხმარებლები (Users)
const userFields = [
  { name: 'name', type: 'text' },
  { name: 'email', type: 'email' },
  { name: 'role', type: 'select', options: ['customer', 'admin'] },
  { name: 'isBlocked', type: 'checkbox' },
]

const userColumns = [
  { key: 'name' },
  { key: 'email' },
  { key: 'role' },
  {
    key: 'isBlocked',
    render: (u) => (u.isBlocked ? 'კი' : 'არა'),
  },
]

export default function AdminPage() {
  const [tab, setTab] = useState('destinations')

  return (
    <div>
      <nav
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 20,
        }}
      >
        <button onClick={() => setTab('destinations')}>
          მიმართულებები
        </button>
        <button onClick={() => setTab('categories')}>
          კატეგორიები
        </button>
        <button onClick={() => setTab('trips')}>
          მოგზაურობები (Trips)
        </button>
        <button onClick={() => setTab('reviews')}>
          შეფასებები (Reviews)
        </button>
        <button onClick={() => setTab('dayPlans')}>
          დღიური გეგმები
        </button>
        <button onClick={() => setTab('users')}>
          მომხმარებლები
        </button>
      </nav>

      {tab === 'destinations' && (
        <ResourceAdmin
          resource="destinations"
          title="სამოგზაურო მიმართულებები"
          fields={destinationFields}
          columns={destinationColumns}
        />
      )}

      {tab === 'categories' && (
        <ResourceAdmin
          resource="categories"
          title="კატეგორიები"
          fields={categoryFields}
          columns={categoryColumns}
        />
      )}

      {tab === 'trips' && (
        <ResourceAdmin
          resource="trips"
          title="მოგზაურობები"
          fields={tripFields}
          columns={tripColumns}
        />
      )}

      {tab === 'reviews' && (
        <ResourceAdmin
          resource="reviews"
          title="შეფასებები"
          fields={reviewFields}
          columns={reviewColumns}
        />
      )}

      {tab === 'dayPlans' && (
        <ResourceAdmin
          resource="dayPlans"
          title="დღიური გეგმები"
          fields={dayPlanFields}
          columns={dayPlanColumns}
        />
      )}

      {tab === 'users' && (
        <ResourceAdmin
          resource="users"
          title="მომხმარებლები"
          fields={userFields}
          columns={userColumns}
        />
      )}
    </div>
  )
}
