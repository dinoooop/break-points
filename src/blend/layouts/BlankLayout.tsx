import type { ReactNode } from 'react';
import { useAuthStore } from '../../helpers/stores/useAuthStore';

interface BlankLayoutProps {
    children: ReactNode
}

const BlankLayout: React.FC<BlankLayoutProps> = ({ children }) => {
    let { theme } = useAuthStore();
    return (
        <div className="container container-admin">
                {children}
            
        </div>
    );
}

export default BlankLayout;