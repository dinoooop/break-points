export const userFieldSet = {
    id: {
        forms: 'edit',
        editRule: 'required|number',
    },
    full_name: {
        label: 'Full Name',
        forms: 'create|edit',
        dummyValue: 'David Grec',
        createRule: 'required|string',
        editRule: 'required|string',
    },
    email: {
        forms: 'create|edit',
        dummyValue: 'grec@mail.com',
        createRule: 'required|email',
        editRule: 'required|email',
    },
    password: {
        forms: 'create',
        dummyValue: 'welcome',
        createRule: 'required|string',
    },
    old_password: {
        forms: 'security',
        dummyValue: 'welcome',
        securityRule: 'required|string',

    },
    new_password: {
        forms: 'security',
        dummyValue: 'welcome',
        securityRule: 'required|string',
    },
    confirm_password: {
        forms: 'security',
        dummyValue: 'welcome',
        securityRule: 'required|string|same:new_password',
    },
    // user profile fields
    phone: {
        forms: 'edit',
        dummyValue: '+12 556 669 36',
    },
    about: {
        forms: 'edit',
        dummyValue: 'A sample text',
    },
    avatar: {
        label: 'Avatar',
        forms: 'create|edit',
        createRule: 'file|aurl|image|maxsize:8',
        editRule: 'file|aurl|image|maxsize:8',
    },
    // Index fields
    search: {
        forms: 'front_index|index',
        indexRule: 'string',
    },
    so: {
        forms: 'index',
        indexRule: 'string',
    },
    sb: {
        forms: 'index',
        indexRule: 'string',
    },
    page: {
        forms: 'index',
        indexRule: 'number',
    },
}
