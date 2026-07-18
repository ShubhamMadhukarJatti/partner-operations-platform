const EMPTY_FIELD_TEMPLATE = {
  name: null,
  firstName: null,
  email: null
}

const SHARKDOM_KEY_TO_BACKEND_FIELD: Record<string, string> = {
  firstName: 'firstName',
  contactEmail: 'email',
  name: 'name'
}

const headers = ['firstname', 'email', 'lastname']
const row = ['John', 'j@d.com', 'Doe']
const tabMapping = {
  firstName: 'firstname',
  contactEmail: 'email'
}

const flat: Record<string, string | null> = { ...EMPTY_FIELD_TEMPLATE }

Object.entries(tabMapping).forEach(([sharkdomKey, fileCol]) => {
  if (!fileCol || fileCol === 'dont_import') return

  const colIdx = headers.indexOf(fileCol as string)
  if (colIdx === -1) return

  const rawVal = row[colIdx]
  const value =
    rawVal !== null && rawVal !== undefined ? String(rawVal).trim() : null

  const backendField = SHARKDOM_KEY_TO_BACKEND_FIELD[sharkdomKey] ?? sharkdomKey
  if (backendField in flat) {
    flat[backendField] = value
  }
})

console.log(flat)
