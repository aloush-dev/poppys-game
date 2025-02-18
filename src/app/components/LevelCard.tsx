export const LevelCard = ({
    title,
    username,
    plays,
    rating,
}: {
    title: string;
    username: string;
    plays: number;
    rating: number;
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-200 h-40"></div>
            <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-600 mb-2">by {username}</p>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{plays} plays</span>
                    <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span>{rating}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

