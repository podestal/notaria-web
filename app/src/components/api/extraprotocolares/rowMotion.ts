export const rowMotionProps = (index = 0) => ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: {
        duration: 0.28,
        delay: Math.min(index, 20) * 0.03,
        ease: "easeOut" as const,
    },
})

export const emptyMotionProps = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut" as const },
}
