export const categoryFieldSet = {
    title: {
        label: 'Category Name',
        forms: 'create|edit',
        dummyValue: 'Home Items',
        createRule: 'required|string',
        editRule: 'required|string',
    },
    description: {
        label: 'Description',
        forms: 'create|edit',
        dummyValue: 'A sample text',
        createRule: 'required|string',
        editRule: 'required|string',
    },
    mode: {
        label: 'Mode',
        forms: 'create|edit',
        dummyValue: [],
        createRule: 'required|string',
        editRule: 'required|string',
    },
    cover: {
        label: 'Cover Image',
        forms: 'create|edit',
        dummyValue: "#",
        createRule: 'file|aurl|image|maxsize:8',
        editRule: 'file|aurl|image|maxsize:8',
    },
    
}