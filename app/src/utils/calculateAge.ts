const parseBirthdate = (birthdate: string): Date | null => {
    const value = birthdate.trim();
    if (!value) return null;

    // DD/MM/YYYY
    if (value.includes('/')) {
        const [day, month, year] = value.split('/');
        const d = Number.parseInt(day, 10);
        const m = Number.parseInt(month, 10);
        const y = Number.parseInt(year, 10);
        if (!Number.isFinite(d) || !Number.isFinite(m) || !Number.isFinite(y)) return null;
        const parsed = new Date(y, m - 1, d);
        if (parsed.getFullYear() !== y || parsed.getMonth() !== m - 1 || parsed.getDate() !== d) return null;
        return parsed;
    }

    // YYYY-MM-DD
    if (value.includes('-')) {
        const [year, month, day] = value.split('-');
        const d = Number.parseInt(day, 10);
        const m = Number.parseInt(month, 10);
        const y = Number.parseInt(year, 10);
        if (!Number.isFinite(d) || !Number.isFinite(m) || !Number.isFinite(y)) return null;
        const parsed = new Date(y, m - 1, d);
        if (parsed.getFullYear() !== y || parsed.getMonth() !== m - 1 || parsed.getDate() !== d) return null;
        return parsed;
    }

    return null;
};

const calculateAge = (birthdate: string, today: Date = new Date()): number | null => {
    const parsedBirthdate = parseBirthdate(birthdate);
    if (!parsedBirthdate) return null;

    let age = today.getFullYear() - parsedBirthdate.getFullYear();
    const monthDiff = today.getMonth() - parsedBirthdate.getMonth();
    const dayDiff = today.getDate() - parsedBirthdate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age -= 1;
    }

    return age >= 0 ? age : null;
};

export default calculateAge;

