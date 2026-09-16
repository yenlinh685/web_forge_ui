import confetti from 'canvas-confetti'

const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min
}

export const createCanvasConfetti = ({ x, y }: { x?: number; y?: number }) => {
    confetti({
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        particleCount: randomInRange(50, 100),
        origin: { y: y || 1, x: x || 0.5 },
    })
}
