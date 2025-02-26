export const ErrorModal = ({
    title = "Error",
    message,
}: {
    title?: string;
    message: string;
}) => {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <h2 className="text-xl font-bold text-red-600">{title}</h2>
                <p className="mt-2 text-gray-700">{message} </p>
            </div>
        </div>
    );
};

