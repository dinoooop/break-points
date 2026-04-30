export const subjectFieldSet = {
   
    title: {
        label: "Subject Title",
        forms: "create|edit",
        dummyValue: "Subject 1",
        createRule: "required|string",
        editRule: "required|string",
    },
    description: {
        label: "Description",
        forms: "create|edit",
        dummyValue: "A sample text",
        createRule: "required|string",
        editRule: "required|string",
    },
    mode: {
        label: 'Mode',
        forms: 'create|edit',
        rfsd: 'date_type', //required field set default 
        createRule: 'required|string',
        editRule: 'required|string',
    },
    threshold: {
        label: "Threshold",
        forms: "create|edit",
        dummyValue: "10",
        createRule: "required",
        editRule: "required",
    },
    last_end_date: {
        label: "Starting Date",
        forms: "create|edit",
        createRule: "",
        editRule: "",
        default_value: new Date().toISOString().split('T')[0],
        description: "The subject is start using from this date.",
    },
    end_reading: {
        label: "Start Reading",
        forms: "create|edit",
        createRule: "",
        editRule: "",
        description: "The subject is start using from this reading.",

    },
};

