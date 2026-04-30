export const breakPointFieldSet = {
    subject: {
        label: "Subject",
        forms: "create|edit",
        createRule: "required",
        editRule: "required",
    },
    description: {
        label: 'Description',
        forms: 'create|edit',
        dummyValue: 'A sample text',
        // createRule: 'required|string',
        // editRule: 'required|string',
    },

    reading_date: {
        label: "Reading Date",
        forms: "create|edit",
        createRule: "",
        editRule: "",
        default_value: new Date().toISOString().split('T')[0],
    },
    end_date: {
        label: "End Date",
        forms: "create|edit",
        createRule: "",
        editRule: "",
        default_value: new Date().toISOString().split('T')[0],
    },
    end_reading: {
        label: "End Reading",
        forms: "create|edit",
        createRule: "",
        editRule: "",
    },

};

