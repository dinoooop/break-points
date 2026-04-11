import type { ReactNode } from 'react';
import { useAuthStore } from '../../helpers/stores/useAuthStore';

interface BlankLayoutProps {
    children: ReactNode
}

const BlankLayout: React.FC<BlankLayoutProps> = ({ children }) => {
    let { theme } = useAuthStore();
    return (
        <div className={theme}>
            <div className="container-blank">
                {children}
            </div>
        </div>
    );
}

export default BlankLayout;