'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import TippyHeadless from 'huanpenguin-tippy-react/headless'
import { Search as SearchIcon } from 'lucide-react'
import { Placement } from 'tippy.js'
import { useDebounce } from 'use-debounce'

import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import handleApiError from '~/helper/handleApiError'
import { cn } from '~/lib/utils'
import { ApiResponse } from '~/types/apiResponse.type'
import { SearchModel, SearchResult, SearchTypes } from '~/types/search.type'
import * as searchServices from '~/services/searchService'

interface SearchProps {
    className?: string
}

const DEBOUNCE_DELAY = 500

const Search = ({ className = '' }: SearchProps) => {
    const [searchValue, setSearchValue] = useState('')
    const [showResult, setShowResult] = useState(false)
    const [searchResult, setSearchResult] = useState<ApiResponse<SearchResult> | null>(null)

    const [debounceValue] = useDebounce(searchValue, DEBOUNCE_DELAY)

    useEffect(() => {
        const handleSearch = async () => {
            try {
                if (!debounceValue) {
                    return
                }
                const res = await searchServices.search({ q: debounceValue })

                setSearchResult(res)
                setShowResult(true)
            } catch (error) {
                handleApiError(error)
            }
        }

        handleSearch()
    }, [debounceValue])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)

        if (!e.target.value.trim()) {
            setSearchResult(null)
            setShowResult(false)
        }
    }

    const renderResult = (attrs: {
        'data-placement': Placement
        'data-reference-hidden'?: string
        'data-escaped'?: string
    }) => {
        return (
            <Card {...attrs}>
                <CardContent className="px-3">
                    {searchResult?.data && (
                        <div className="flex flex-col gap-2">
                            {(Object.keys(searchResult.data) as SearchTypes[]).map((key: SearchTypes) => {
                                const keyMapping: Record<SearchTypes, string> = {
                                    courses: 'Khóa học',
                                }

                                return (
                                    <div key={key}>
                                        <p className="ml-2 text-sm font-medium">{keyMapping[key]}</p>

                                        <div className="mt-2 flex cursor-pointer flex-col gap-1">
                                            {searchResult?.data[key].map((item: SearchModel) => {
                                                return (
                                                    <div
                                                        className="hover:bg-muted flex items-center gap-3 rounded-md p-2"
                                                        key={item.id}
                                                    >
                                                        <Image
                                                            src={item.image_url}
                                                            alt=""
                                                            width={400}
                                                            height={400}
                                                            className="h-12 w-12 rounded-md object-cover"
                                                            quality={100}
                                                        />

                                                        <div>
                                                            <p className="font-medium">{item.name}</p>
                                                            <p className="text-muted-foreground line-clamp-1 text-sm">
                                                                {item.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        )
    }

    const handleClickOutside = () => {
        setShowResult(false)
    }

    const handleFocus = () => {
        setShowResult(true)
    }

    return (
        <TippyHeadless
            interactive
            visible={showResult && searchResult !== null}
            render={renderResult}
            placement="bottom-start"
            offset={[0, 8]}
            onClickOutside={handleClickOutside}
            popperOptions={{
                modifiers: [
                    {
                        enabled: true,
                        fn({ state }) {
                            state.styles.popper.width = `${state.rects.reference.width}px`
                        },
                        phase: 'main',
                    },
                ],
            }}
        >
            <div className={cn('relative w-full max-w-100', className)}>
                <SearchIcon size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-600" />
                <Input
                    placeholder="Tìm kiếm khóa học, dự án ..."
                    className="w-full rounded-full py-5 pl-9"
                    onChange={handleChange}
                    onFocus={handleFocus}
                />
            </div>
        </TippyHeadless>
    )
}

export default Search
