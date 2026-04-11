import { Link } from "react-router-dom";

type SubmitProps = {
    label?: string;
    cto?: string;
    loading?: boolean;
    cssClass?: string;
};

export default function Submit({ label, cto, loading, cssClass = 'btn submit mt-1' }: SubmitProps) {
    
    const newLabel = loading? "..." : (label ?? "Submit")
    return (
        <>
            <button type="submit" className={cssClass}>{newLabel}</button>
            {cto && <Link to={cto} className="btn">Cancel</Link>}
        </>
    );
}
