/** Scoped pointer styles for SISGEN buttons (including portaled modals). */
const SisgenPointerStyles = () => (
    <style>{`
        .sisgen-ui button:not(:disabled),
        .sisgen-ui [role="button"]:not([disabled]):not([aria-disabled="true"]) {
            cursor: pointer;
        }
        .sisgen-ui button:disabled,
        .sisgen-ui [aria-disabled="true"] {
            cursor: not-allowed;
        }
    `}</style>
)

export default SisgenPointerStyles
