export const contactRule: Record<string, string> = {
    name: 'required|string|min:5|max:35',
    email: 'required|email',
    message: 'required|min:10|max:50',
}