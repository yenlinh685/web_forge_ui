interface AppEvents {
    'toc:section-change': { hash: string }
    'toc:pause-observer': { duration: number }
    'sidebar:toggle-mobile-sidebar': null
    'lesson-code:run-test-case': null
}

export type { AppEvents }
