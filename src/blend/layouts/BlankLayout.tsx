import type { ReactNode } from 'react';

interface BlankLayoutProps {
    children: ReactNode
}

const BlankLayout: React.FC<BlankLayoutProps> = ({ children }) => {
    return (
        <div className="container container-admin">
                {children}
            
        </div>
    );
}

export default BlankLayout;
