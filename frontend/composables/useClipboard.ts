const toast = useToast()

export const useClipboard = () => {
    const copy = (text: string, { title, description }: { title?: string, description?: string } = {}) => {
        try {
            navigator.clipboard.writeText(text);
            toast.add({
                title: title || 'Success',
                description: description || 'Copied to clipboard',
                color: "green",
                icon: "i-tabler-check"
            });
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            toast.add({
                title: 'Error',
                description: 'Could not copy to clipboard',
                color: 'red',
            });
        }
    };

    return {
        copy,
    };
}