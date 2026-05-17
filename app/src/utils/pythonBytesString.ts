/** Decode values stored as Python `str(bytes)`, e.g. `b'Juan Pérez'` or empty `b''`. */
export function unwrapPythonBytesString(raw: string | undefined | null): string {
    const s = (raw ?? "").trim()
    if (!s) return ""

    if (s === "b''" || s === 'b""') return ""

    if (s.startsWith("b'") && s.endsWith("'") && s.length > 3) {
        return s.slice(2, -1).replace(/\\'/g, "'").replace(/\\\\/g, "\\")
    }
    if (s.startsWith('b"') && s.endsWith('"') && s.length > 3) {
        return s.slice(2, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\")
    }

    return s
}

/** True when the API sent an empty or missing bytes-wrapped responsable name. */
export function isEmptyPythonBytesString(raw: string | undefined | null): boolean {
    return unwrapPythonBytesString(raw) === ""
}
