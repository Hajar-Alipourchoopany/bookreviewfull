import React from 'react';

const ReviewItem = ({ review, onFavorite }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      {review.bookTitle && <h3 className="text-xl font-bold mb-2">{review.bookTitle}</h3>}
      <p className="text-gray-800 mb-2">{review.review_text}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">{review.username}</span>
        <span className="text-sm text-gray-600">{review.rating} Stars</span>
      </div>
      <button
        className="mt-2 text-red-500 hover:text-red-700 focus:outline-none"
        onClick={() => onFavorite(review._id)}
      >
        ❤️
      </button>
    </div>
  );
};

export default ReviewItem;
