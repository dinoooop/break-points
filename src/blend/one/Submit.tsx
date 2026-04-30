import { Link } from "react-router-dom";

type SubmitProps = {
    label?: string;
    cto?: string;
    loading?: boolean;
    cssClass?: string;
    serverError?: string;
    formError?: string;
};

export default function Submit({ 
    label, 
    cto, 
    loading, 
    cssClass = 'btn submit mt-1',
    serverError,
    formError
}: SubmitProps) {

    const newLabel = loading ? "..." : (label ?? "Submit")
    return (
        <>
            <button type="submit" className={cssClass}>{newLabel}</button>
            {cto && <Link to={cto} className="btn cancel">Cancel</Link>}
            {serverError && <p className="error-text">{serverError}</p>}
            {formError && <p className="error-text text-center">There are errors in the form.</p>}
        </>
    );
}
