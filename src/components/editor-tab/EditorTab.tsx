import React from 'react'
import Image from 'next/image'
import { Eye } from 'lucide-react'

import { useSortable } from '@dnd-kit/react/sortable'
import { getFileIcon } from '~/helper/editor'
import { cn } from '~/lib/utils'
import { CodingFileModel } from '~/types/lesson.type'

interface EditorTabProps {
    file: CodingFileModel
    index: number
    activeFileId: string | number | null
    setActiveFileId: (id: string) => void
    dirtyFileIds: Set<string | number>
}

const EditorTab: React.FC<EditorTabProps> = ({ file, index, activeFileId, setActiveFileId, dirtyFileIds }) => {
    const { ref } = useSortable({ id: file.id, index })

    return (
        <div
            ref={ref}
            onClick={() => setActiveFileId(file.id)}
            className={cn(
                'flex w-fit max-w-50 cursor-pointer items-center gap-2 bg-(--editor-tab-bg) px-3 py-2 text-white',
                {
                    'border-chart-2 border-b-2': activeFileId === file.id,
                },
            )}
        >
            <Image src={getFileIcon(file.file_name)} alt={file.file_name} width={16} height={16} />

            <p className="text-sm">{file.file_name}</p>

            {file.read_only && <Eye size={14} className="text-muted-foreground" />}

            {dirtyFileIds.has(file.id) && (
                <div
                    className={cn('size-2 rounded-full bg-white', {
                        'opacity-0': !dirtyFileIds.has(file.id),
                    })}
                />
            )}
        </div>
    )
}

export default EditorTab
