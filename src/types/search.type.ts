export type SearchTypes = 'courses'

export interface SearchResult {
    courses: SearchModel[]
}

export interface SearchModel {
    id: string
    name: string
    image_url: string
    description: string
    type: SearchTypes
}
