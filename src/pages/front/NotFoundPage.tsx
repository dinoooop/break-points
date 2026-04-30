import React from "react";
import BlankLayout from "../../blend/layouts/BlankLayout";


const NotFoundPage: React.FC = () => {
    return (
        <BlankLayout>
            <h1>404</h1>
            <p>Sorry, the page you are looking for could not be found</p>
        </BlankLayout>
    );
};

export default NotFoundPage;
