import { ReactNode } from "react";

interface Props {
    title: string;
    subtitle?: string;
    children: ReactNode;
}

const AbogadoCard = ({ title, subtitle, children }: Props) => {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <header className="mb-4 border-b border-slate-100 pb-3">
                <h3 className="text-base font-semibold text-slate-800">{title}</h3>
                {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
            </header>
            {children}
        </section>
    );
};

export default AbogadoCard;
