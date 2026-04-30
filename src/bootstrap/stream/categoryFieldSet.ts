export const categoryFieldSet = {
    title: {
        label: 'Category Name',
        forms: 'create|edit',
        dummyValue: 'Home Items',
        createRule: 'required|string',
        editRule: 'required|string',
    },
    category_current_reading: {
        label: 'Current Reading',
        forms: 'create|edit',
        dummyValue: 0,
        // createRule: 'number',
        // editRule: 'number',
        defaultValue: 0,
        description: 'Useful for tracking subject with reading mode.',
    },
    description: {
        label: 'Description',
        forms: 'create|edit',
        dummyValue: 'A sample text',
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