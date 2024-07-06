export type RegistrationFormData = {
  name: string
  address: string
  menu: Array<{
    ingredients: string
    name: string
  }>
}

export type Business = {
  name: string
  address: string
  menu: Array<{
    ingredients: string
    name: string
  }>
  _id: string
  regNumber: number
  reports: string[]
}
