export const authFieldSet = {
    full_name: {
        label: 'Full Name',
        forms: 'register',
        dummyValue: 'John Doe',
        registerRule: 'required|string',
    },
    email: {
        forms: 'login|register',
        dummyValue: 'john@mail.com',
        // dummyValue: 'admin@mail.com',
        loginRule: 'required|email',
        registerRule: 'required|email',
    },
    password: {
        forms: 'login|register',
        dummyValue: 'welcome',
        loginRule: 'required|string',
        registerRule: 'required|string',

    },
    confirm_password: {
        forms: 'register',
        dummyValue: 'welcome',
        registerRule: 'required|string',
    },
}